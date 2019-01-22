---
layout: post
title: Thread-safe queues in Clojure
date: 2019-01-22 08:00:00
disqus: y
---

Imagine the following: You have a pool of workers. Each worker should
get an item from a queue and process it.

## Using "workers" from core.async

Great! How do we launch those workers? Let's use `core.async` for
that, specifically `go`:


``` clojure
(require '[clojure.core.async :as async :refer [go]])

(dotimes [i 10]
  (go
    (println "Processing" i)))
```

By the way, `core.async` has a fixed-size thread pool of 8 workers,
but that's stuff for another post.

Every time `dotimes` runs with a new value of `i`, it starts a new
`go`-block, simulating an asynchronous job running on the thread
pool. The `go` will return immediately, more specifically, it will
return a channel.

This will print `Processing 0`, `Processing 1`, etc. to the
console. Those `Processing` lines will appear almost at the same
time. They won't be in the correct order though. That's fine.

Now we want to keep track of completed jobs. How can we accomplish
that?

## Keeping track of completed jobs

Let's introduce a vector in an atom to keep track of completed jobs:

``` clojure
(let [completed (atom [])]
  (dotimes [i 10]
    (go
      (swap! completed conj i)))

  ;; hacky! don't do this at home. wait for the workers to finish
  (Thread/sleep 100)

  ;; return the value of the atom by dereferencing it
  @completed)
```

After each job is completed in a `go` block, we add its index `i` to
the `completed` vector. `conj`ing to a vector adds it to the end of it
so that's perfect for us. We wait a few milliseconds (100) for the
workers to finish, then return the value of the atom by dereferencing
it with `@`.

Running this would yield an output like this:

``` clojure
[1 6 7 5 8 3 9 4 0 2]
```

No surprises there. All jobs defined by the index `i` get done.

What if you want to process a queue of arbitrary things, not integer
indices like in our example?

If your items are known from the start, it's easy: You could replace
`dotimes` above with `doseq` and replace `10` with your collection,
e.g. `(range 10)`. A better and more elegant way would be using
[pipeline] (material for another post, again).

## Using atoms to keep track of jobs-to-be-done?

But what if not all of your items are known from the start? Then,
things get hairy. Consider this:

``` clojure
;; don't use this!
(let [queue     (atom (vec (range 20)))
      completed (atom [])]
    (dotimes [i (count @queue)]
      (go
        ;; get the first item off the "queue"
        (let [item (peek @queue)]
          ;; simulate some light work which takes 2ms
          (Thread/sleep 2)
          ;; add the item to the vector of completed items
          (swap! completed conj item)
          ;; update the queue by removing this item from it
          (swap! queue pop))))

    ;; hacky! wait for workers to finish
    (Thread/sleep 100)

    ;; return the completed items
    @completed)
```

Do you see the problem? Have a look at this output:

``` clojure
[19 19 19 19 19 19 19 19 12 12 11 11 12 11 11 11 4 4 6 6]
```

Oh god! What happened?

The first worker peeked at the queue and got the value `19`. Then, it
started "processing" it (via `Thead/sleep`) which took 2ms. In the
meantime, the second worker peeked at the queue which was still
unchanged and got the value `19`. It also started processing it for
2ms.

When the first worker was done, it `swap!`ed the queue and `pop`ped
it, removing 19. Shortly after, the second worker was done, also
`pop`ped it, removing 18.

Wait, now 18 wasn't processed at all - woops.

## Atomic Popping?

The problem here is that the `peek` and `pop` operation should execute
atomically, i.e. we want to pop but also receive the value which we
have popped off the queue.

You may now think "but if we move the `swap!` just below the `peek`,
then we're fine!" - nope, sadly we don't get any guarantee that those
two statements are executed with nothing in between.

## Languages with Mutability

Thinking about this, in programming languages with mutability, this is
fairly easy. Python and Java have queue data types which remove and
return an item at once, mutating the queue. With Clojure's immutable
data structures, this actually is a bit tricky.

## Solve it with `ref`s and STM?

Our problem boils down to "we want to peek at a queue and pop it at
once". Could Clojure's STM with `ref`s solve this problem?

Let's give it a go. The changes are straightforward which is a
compliment to Clojure's language design. We exchange our `atom` for a
`ref` and the `swap!`s for `alter`s. Further, we wrap the operation
which should run "at once" in `dosync`:

``` clojure
;; don't use this!
;; note that `queue` is now a `ref`
(let [queue     (ref (vec (range 20)))
      completed (atom [])]
    (dotimes [i (count @queue)]
      (go
        ;; get the first item off the "queue"
        ;; refs can also be dereferenced, just like atoms
        (let [item (peek @queue)]
          ;; use dosync here
          (dosync
            ;; simulate some light work which takes 2ms
            (Thread/sleep 2)
            ;; add the item to the vector of completed items
            (swap! completed conj item)
            ;; update the queue by removing this item from it
            (alter queue pop)))))

    ;; hacky! wait for workers to finish
    (Thread/sleep 100)

    ;; return the completed items
    @completed)
```

Looks good? Here's the output:

``` clojure
[19 19 19 19 19 19 19 19 19 19 19 19 19 19 19 ...]
```

It didn't work again but in a different way (um.. progress?).

STM allows us to maintain "integrity" *between* `ref`s. So if you
would be running bank transactions, you'd want to use `ref`s as hey
would ensure that any time you deduct money from an account you also
successfully deposit it in another.

Our use case is different though: We just want to peek and pop at once
from a single `ref`. This is not a problem for `ref`s to solve.

Side note: I'm not an STM / Clojure `ref` expert. It would be
interesting to understand the differences of the past two
examples. Also, replacing `alter` with `commute` changes things in yet
another way. Fascinating.

## Taking a Step Back

Pondering this problem, it boils down to this:

 * Clojure's data structures are immutable
 * An `atom` is the recommended way of storing data which can be
   accessed in a shared way (by multiple workers)
 * Due to immutability, we can't `peek` and `pop` at the same time

So how can we `peek` and `pop` on an atom at the same time?

Turns out, `clojure.core` has us covered! With `swap-vals!`, we can
get both the old and new value of an atom. This is how it works:

``` clojure
(def queue (atom [0 1 2 3]))
(swap-vals! queue pop)
```

Which returns:

``` clojure
[[0 1 2 3] [1 2 3]]
```

`swap-vals!` returns a vector in which the first item is the old value
of the atom and the second one is the new value. If we call `pop` on
`queue` above, we can easily see that the popped item of the old queue
is `0` (it's missing in the new queue), we just would have to call
`first` on it the old one to peek.

With this in mind, let's fix our code:

``` clojure
;; correct solution
(let [queue     (atom (vec (range 20)))
      completed (atom [])]
    (dotimes [i (count @queue)]
      (go
        ;; change the queue by popping it. also get the old
        ;; queue. from the old queue, get the first item
        ;; which is the item we want to process
        (let [[old new] (swap-vals! queue pop)
              item (peek old)]
          ;; simulate some light work which takes 2ms
          (Thread/sleep 2)
          ;; add the item to the vector of completed items
          (swap! completed conj item))))

    ;; hacky! wait for workers to finish
    (Thread/sleep 100)

    ;; return the completed items
    @completed)
```

What's the result?

``` clojure
[15 17 16 12 19 14 18 13 11 9 10 5 4 8 6 7 2 1 0 3]
```

Awesome! We're done :)

Well, not quite. There are still some improvements.

## Improvement: Use clojure.lang.PersistentQueue

So far we've been (mis-)using a vector as queue. Did you know that
Clojure has a queue data type?

You can create an empty queue by calling
`(clojure.lang.PersistentQueue/EMPTY)`. It supports `peek` and `pop`.

It's also a persistent and immutable data structure so you'll still
have to wrap it in an `atom` and use the `swap-vals!` approach :)

## Alternative: Use a Java Queue

If you feel like venturing out into the dangerous forest of
Mutability, you could use a Java Queue.

The ClojureScript compiler actually does that. When you specify
`:parallel-build true` in the build options, in constructs a
`LinkedBlockingDeque` with things-to-be-compiled and calls
`.pollFirst` to pop.

Check out [the implementation][clojurescript-parallel-build] if you're
interested.

## Further Reading

 * [Stackoverflow question][stackoverflow-question] which prompted me
   to write this post.
 * [`pmap` implementation][pmap-implementation] which has nothing to
   do with queues and `core.async` but is interesting to look at. It's
   implemented with `future`s and a `lazy-seq`.

## Bonus: Explaining this to non-programmers

I was on a walk with a friend who's not into coding but was
nonetheless interested in what I was writing. I came up with this
analogy:

Imagine you're running an Asian food-delivery restaurant (that's what
we do as Asians). You cook meals and put them into take-out boxes. To
deliver those, you have a driver. For the driver to know which box is
the "oldest" (the one which has been waiting the longest time for
delivery), you put the boxes in a line, sorted by when you finished
them - a queue. The driver picks up the oldest box, delivers it to a
customer and then comes back and picks up the next oldest one. Let's
ignore the inefficiency of only delivering one box at a time. Pretty
simple, right?

Now you have more customers and want to increase deliveries. You hire
more drivers. Any time a driver comes to your restaurant, he picks up
the oldest box and delivers that to the customer. If another driver
arrives at the restaurant in the meantime, he picks up the oldest box
which is currently there.

What happens if two drivers arrive at the restaurant at the same time?
Well, human behaviour: The one who reaches the line of boxes first
grabs the oldest one while the other one waits for a few
seconds. Then, the other one proceeds to grab the next oldest one. No
problem.

But, see, in computer software you don't have human behaviour to save
you from these so-called "race conditions". It could happen that both
drivers arrive at the same time, spot the same oldest box and grab it
at the same time! Worse yet, both of them could take it and suddenly
you have two copies of the same box! The customer only ordered one but
will be happy receive two boxes of the same food.

Imagine this happening with 100 drivers arriving at the
restaurant. The customer will be less happy about 100 boxes.

How to solve this? You make changes to the queue atomic. That probably
doesn't make any sense to you, so here's the analogy: In the
restaurant, an old Chinese lady sits at the entrance to the room full
of boxes. Drivers arrive. She only allows one driver to go in at a
time, pick up the oldest box and go out. Then, the next driver is
permitted to go in.

The drivers always respect these rules because she's a secret kung fu
master.

So there you have it. If you have race conditions in your code,
consider installing an old Chinese lady in it.


<!-- Links -->

[pipeline]: https://clojuredocs.org/clojure.core.async/pipeline
[clojurescript-parallel-build]: https://github.com/clojure/clojurescript/blob/4d54c041703672600eece45d67e559e769f68dbf/src/main/clojure/cljs/closure.clj#L1027
[stackoverflow-question]: https://stackoverflow.com/questions/18785871/which-is-the-ideal-clojure-concurrency-construct-for-maintaining-queue-of-data-t
[pmap-implementation]: https://github.com/clojure/clojure/blob/28b87d53909774af28f9f9ba6dfa2d4b94194a57/src/clj/clojure/core.clj#L7012
