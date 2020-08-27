---
layout: post
title: Regulation Is Killing Medical Software Innovation
date: 2020-08-27 07:00:00
---

I'm back from cryosleep. After [leaving Merantix Healthcare][pioneers-process-people] 7 months ago I haven't
been writing much. I took the summer off to finish my pilot's license and to try out a few things on the
side.

One of them was doing regulatory consulting for medical software startups. Remember: At Merantix Healthcare
(now: Vara), we managed to pass all regulatory hurdles to bring our Machine Learning - based Radiology
software to market. At the time I thought this was quite an unspectacular achievement, but apparently many
other companies fail at it.

So, shortly after becoming unemployed, random people started emailing me with requests like "Hey, work as a
consultant for us, we pay you money, start tomorrow". I started calling it the *magical consulting business
with zero marketing*.

It's not like I was keen to do it, but it was worth a try.

I approached it with an open mind. Half a year later, after having succesfully worked with four companies,
here's my verdict: It sucks.

Why? Many reasons. But let's take a step back first.

What is regulation? (Bear with me) in human language, *regulation* is a list of hoops some authority puts in
your way of accessing the market. Everyone in your industry has to jump through these hoops.

Here's the thing: In a sane world, with rational people, we wouldn't need any regulation. People would be
building perfectly safe software. Like, they wouldn't write buggy code that crashes and [shoots high doses of
radiation at patients][therac-25]{:target="_blank"}.

Having perfect software is a utopic scenario. Software is never perfect. And even if most people build safe
stuff most of the time, just a small group of reckless individuals is enough to cause disaster.

That's where regulation comes in. Regulation basically says: "Hey, this one company screwed up big time
recently, so from now on, every company has to comply with this list of things we came up with. Those measures
will surely prevent that from happening again!".

And that sucks. Because what did we do? We took the maximum observed stupidity of our society (writing buggy
code that emits radiation) and now we *assume* that 1) everyone else is just as stupid and 2) that some rules
we came up with will prevent the problem in the future.

Let's think about these assumptions.

### 1) Can We Assume Everyone to Be Stupid?

Does it really sound like a good approach to subject everyone to the same standards? Standards which were
created based on the most incapable person, the *most-stupid-denominator*?

This reminds me of working at the office (good times). In any company, there are always some people who are
more messy than others. Or should we rather say: Less diligent. While you're trying to write code, they have
loud phone calls on speakerphone. They enter your meeting room and don't close the door. Sometimes they
"forget" to use the toilet brush after deploying a large payload.

Now, how do you deal with these problems? You have two options:

You talk to those people individually. This is not only the most discreet, but also the most effective
way. It's also the hardest. At least for you: It takes courage to approach that person and deliver that sort
of message. But it's the right thing to do.

The other option would be: You attempt to *generalize* the problem and solve it *generically* by establishing
new company policies. You put up a sign in the open office saying "No loud phones calls!". On all meeting room
doors, you write "Please close the door". And in each bathroom, you hang up a framed SOP for when to use the
toilet brush.

This is how large companies deal with those problems, and companies in which people don't have the guts to
talk about problems one on one. It's a cowardly and ineffective move. Guess what - the dude who has loud phone
calls will most likely not read a random sign on the wall. And all other people who were behaving perfectly
fine are now subjected to a barrage of useless signs which assume they're utterly incompetent at breathing.

Unfortunately, regulation tries to solve problems in the same way.

Developers are expected to create hundreds of pages of documentation to prove that they've really tested
everything. They must write a development plan to ensure that they're actually capable of developing whatever
they wanted to build (?). They have to make a list of their dependencies and test them (!).

If your development team is incompetent, forcing them to write a development plan won't increase their code
quality. It only increases overhead.

Funnily enough, the same incompetent developers will pass all regulatory hurdles as long as they're creating
the right documentation. A scary thought. Which leads me to the next question:

### 2) Will Our Rules Prevent the Problem?

Anyone who has ever observed complex systems knows: It's hard to come up with interventions which actually
provide the desired outcome.

Say, your garden has snakes. You don't like that because you want to sit on your patio and you're scared of
snakes. So you put a honey badger there to chase away the snakes. Great, the snakes are gone. But now the
honey badger is settling down on your patio and has invited all his honey badger friends to hang out
there. Bad luck for you. A second order effect!

Is developing (medical) software a complex process? And, if so, can regulation be compared to a honey badger?
I think so.

We are introducing measures which we *assume* will improve things, because they were *associated* with certain
problems in the past. But in reality we don't know if they were *causing* them. We just mixed up correlation
and causation.

It's like observing people with Covid and saying "Aha! Those Covid patients are coughing! So let's tell all
healthy people not to cough and they'll be fine!". Luckily our standards of medical science are better than
that. New treatments have to undergo clinical trials in which they must show an improvement in patient
outcome. Do our regulatory measures undergo similar testing? I'm not sure.

But one things *will* happen for sure: The list of hoops all future companies have to jump through just became
longer. And guess what? The useful time they can spend on developing their product has shrunk, again.

But here's the worst part. After we've introduced our measures, software actually became safer. That leads us
to wrongly assume that *we chose the right measures* and *those measures caused improvements in safety*. But I
don't think that's true. Sure, we achieved our goal, but we don't know *how*. Sounds like alchemy! A dangerous
situation.

I call these *second order effects of regulation*.

## Second Order Effects?

Do our regulatory measures *cause* us to develop safer software? Or are we kicking off second-order effects
and just accomplishing our goals by coincidence?

Let's look at the facts.

Building medical software has tons of additional overhead. This leads to slower development, additional hires
and more audits. What do companies need when development slows down, head count increases and auditors knock
on your door? Right - more money.

We're severely limiting the number of companies who can enter the market by raising the bar of funding
required.

What are the consequences?

Only companies with a lot of funding (and time) are able to enter the market. A two-person startup can't
afford to hire expensive staff for regulatory compliance. And they sure as hell can't afford to put countless
man-hours into documenting regulatory-compliant processes! What sort of processes do you need in a two-person
startup, anyway?

So: We've successfully prevented small startups from entering the market.

What's the main difference between small startups and large companies? Small startups develop products which
solve existing problems in a novel way. They accomplish this through innovation which others deemed
infeasible, or too *risky*, or both.

*Risky*. That's the difference.

GE, Philips, Siemens - do you expect those enterprises to ship a *risky*, groundbreaking Machine Learning -
based Radiology software which radically automates radiology assessments? Hell no. You can hardly expect them
to ship any features at all. They're too scared of changing things. They're scared of things going wrong,
their public image taking a hit and losing their existing customers. They are *risk-averse*.

So, yes, our medical software has become safer, but not due to our regulatory requirements. Rather because
we've created a heavy selection bias of only allowing large, well-funded, risk-averse companies to enter the
market.

We achieved safety at the cost of killing innovation. Flying an airplane, we would say: Great landing, wrong
airport.

## A Decision We Have to Make

Nowadays, the daring two-person startup can no longer enter the market and reach patients. That's where
innovation would have happened.

Is that a bad thing? Well, it depends.

Safety and progress are often on opposing ends of a spectrum - in most cases, you can't have both. We, as a
society, have chosen to heavily favor safety over progress. Better keep things the way they are, because new
things can go wrong. And that's a fair decision to make.

But I think we're making the wrong decision. Because most of us are blind to the opportunity cost of *not
innovating*. We don't see what would have happened to patients if we had had better software.

While I was working in the hospital, I would regularly be involved in admitting new patients. You won't
believe how often they didn't have an up-to-date list of their medication. I'd have to call their GP and
request their medication list to be *faxed*, if I could reach the GP at all. This process was slow and
error-prone.

Consider: If you're hit by a car and wheeled into the ER, do you want your medication list to be unavailable
because your GP is unreachable? Do you want your patient history to be lost because it's on paper, stashed
away in some drawer? Do you want to be exposed to additional radiation for imaging because your old images
are on a CD at your parents place?

Just how many processes could we have streamlined, how many outcomes and lives could we have improved with
better software? We don't know. And that's the thing.

## Progress?

Is there any regulated industry which still makes progress nowadays? As I'm finishing my pilot's license, I'd
argue yes, there's Aviation. Safety is improving (even despite the 737 MAX fiasco). Also, automation is
progressively introduced in a sane, effective and safe way.

Why? Personally, I think that a huge difference is that failures are more obvious.

It's obvious when a plane crashes and people die - it's all over the news.

Compare that to hospitals: If someone dies in a hospital due to being given wrong medication because the
hand-written doctor's note was read wrongly - is it all over the news? Hell no. People die all the time in
hospitals. And we certainly don't have a culture of admitting medical mistakes. It doesn't become apparent
when things go wrong.

Consider: How would you feel if plane accidents occurred daily and would be just as accepted as Healthcare
failures currently are? Like, "you know, every day a few planes crash, that's just how it is". Nobody talks
about it. Nobody really knows how many planes crash at any given time. You now, people just go to the airport
and hope for the best.

Just like people currently go to the hospital.

Sure, due to increasing regulation, building new airplanes has become very expensive. But in aviation, maybe
regulation was a good thing. Because we had an overarching goal and achieved it: We can offer people air
travel which is affordable, reliable and safe.

Can we say the same about Healthcare?



<!-- Links -->

[pioneers-process-people]: {% link _posts/2020-01-31-pioneers-vs-process-people.md %}
[therac-25]: https://en.wikipedia.org/wiki/Therac-25
