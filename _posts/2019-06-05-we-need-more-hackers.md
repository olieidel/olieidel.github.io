---
layout: post
title: We need more Hackers
date: 2019-06-05 12:00:00
disqus: y
---

## The Hacker's First Project

When I was a kid, I wanted to code my own website. I was already using
Dreamweaver to crank out static HTML web pages but this was
different. I needed to learn PHP to create a website which would earn
passive income for the rest of my life. Very important!

The idea was already clear in my mind and I just needed to code the
damn thing. I read through a very superficial guide on PHP 3 (yes, the
stone age) and got started.

As I was 13 at the time, I had to go to school during the day but the
afternoons were for free for hacking. True hacking! I didn't have an
IDE, I just popped open Notepad. I didn't have a runtime, I just
FTP-ed into my server and uploaded the PHP files to production. I
created the schema for my MySQL database in phpMyAdmin. I inlined all
sorts of PHP into HTML and HTML into PHP. I didn't know what SQL JOINs
were, I would do them manually in my PHP code. Of course I didn't know
about indices.

And it worked. And I was fast. I shipped it after a few
weeks. Actually, I didn't have to ship it - I had been developing on
the production server all along.

The first day the site was ~~online~~ public, it had 68 sign-ups
without any marketing. During the next two weeks, nearly 1000 people
signed up. It's still the most successful project I've ever launched
and quite some time has passed as I'm a bit older than 13 now.

Fun fact: It never had any performance issues. And it was seeing some
significant traffic! Hell, it was running on a shared server with like
20-50 other tenants on it. Keep that in mind next time you refactor
your microservices to scale to crowds of users which don't exist.

But let's think about the 13-year-old me, hacking in Notepad: That's
the greatest combination ever. A person who has encountered a problem
and already knows how the solution looks. It just has to be
implemented.

Let's call that person a Hacker. The Hacker doesn't care about style
guides, design patterns and performance optimization. The Hacker cares
about solving the problem as fast as possible. The Hacker doesn't get
caught up in technology decisions. As long as the technology can be
bent to solve the problem, it suffices. The Hacker just starts
hacking.

We need more hackers.

Or do we? Most of us developers actually started out as Hackers. We
wanted to build something cool and learnt how to code in the
process. Fast-forward three years and we're standing in front of
whiteboards, writing down user stories and debating UML diagrams.

What the hell happened?

I think there are two things at play here: The "Second Project" effect
and "Solving other People's Problems".

## The Second Project Effect

I was talking to [Peter][ptaoussanis] some time ago and he noted that
there's an interesting thing that happens to Hackers on their second
project.

Now that they've solved their first problem with technology, they get
more interested in it. Now they want to dive deep and "do it the right
way" for their next project.

They start reading programming books and watch conference talks. They
spend days pondering whether to use MySQL or Postgres. They wonder why
the fault-tolerance of the BeamVM hasn't made it into other virtual
machines. During their sleepless nights, they wonder why the world
hasn't adopted Lisp as superior language.

This is the Second Project Effect. It's when suddenly technology
enters the main stage and the actual problem becomes secondary. And
guess what, when that happens, the problem usually doesn't get solved
very well. Most of the time, the problem didn't even exist at all.

At the time of writing, Blockchain and Deep Learning are examples of
great technology which spawn tons of startups yearning to solve
problems. And if those problems don't exist, well, they'll create
some for you!

## Solving other People's Problems

The other thing which has happened to the UML whiteboard people is
that they're not solving their own problems any more.

There's this magical feedback loop when solving your own problems:
While developing your solution, you can constantly ask yourself "Is
this solving it? What if I change this?" and you'll have answers to
these questions. This way, you can iterate on your solution multiple
times.. *per minute*. It's only limited by the speed of your
thoughts. Those could be a couple hundreds of iterations per day.

Now, what happens if you have to solve someone else's problem? Imagine
you want to apply Blockchain to used car sales but don't even own a
car. If your client (the used car salespeople) is responsive, you can
call them maybe once.. *per week*? So while you'd already have done
hundreds of iterations by yourself for your own problem, you have to
make hundreds of assumptions until presenting your next prototype to
your customers.

This of course opens up a ton of new problems: Firstly, you'll be
developing the wrong thing. Secondly, your customers may not have a
clear idea on what the solution should look like. Maybe the problem
doesn't even exist. Thirdly, as you don't understand the problem, you
won't be able to come up with random ideas which may lead to huge
improvements or new products - like say, using the Beam VM to build a
communications platform for used car salespeople.

## The Return of the Hacker

What can we do to become Hackers again?

Firstly, we must be clear that languages and frameworks are only tools
to solve problems and We must not tie yourself to particular
technology. There's no such thing as an "X programmer" where X is Java
or any other language, as [Steve Yegge][yegge-codes-worst-enemy]
points out.

Secondly, we must attempt to solve real-world problems which we fully
understand.

Sounds simple? Truth be told, only very few people come back from the
dark side to see the light of productivity again. But when they do,
it's fabulous!

It's the quality which is most valuable in a developer: Having seen
multiple programming languages and frameworks, knowing their pros and
cons. Being able to write great, well-documented, polished,
perfectly-tested code - but, and this is important - knowing when to
prioritise shipping over perfection and throwing all those things out
of the window while cranking out the hackiest code ever, solving the
problem because right now, the damn problem needs to be solved.

Crappy code itself doesn't separate good programmers from great
ones. It's the ability to know which aspects of the code are crappy,
why the trade-off was made and when to fix it. It's the constant
internal battle of balancing perfection and hackiness. Great
developers get it just right.


<!-- Links -->

[ptaoussanis]: https://twitter.com/ptaoussanis
[yegge-codes-worst-enemy]: http://steve-yegge.blogspot.com/2007/12/codes-worst-enemy.html
