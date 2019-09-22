---
layout: post
title: "Abstracting Light Switches: How to Solve Real Problems"
date: 2019-09-22 12:00:00
disqus: y
---

Zigbee-enabled light bulbs. Wifi-connected air purifiers. Autonomous
thermostats. The smart home. Great technology. And just like with
machine learning and blockchain, we humans don't quite know yet what
to do with it yet.

Similar to those technologies, the smart home offers solutions for
non-existent problems. Now I can control my light bulbs from an app
instead through a light switch. But wait.. wasn't I faster using the
switch? But having another app is great, I guess. Oh well.

When I moved to Berlin, I took great care in replacing all light bulbs
and thermostats with their smart equivalents. Then, I spun up [home
assistant] on a raspberry pi and, four weekends later, had connected
everything to it. And now, finally, time to code some clever
automations so that my home deserves the name smart home!

So let's get started. Let's make a list of things to automate!

Hm.

Maybe not a list.. what would the first thing be to automate?

Hm.

Anything?

Empty thoughts.

Just like with machine learning and blockchain, using a certain
technology as starting point and looking for problems to solve is a
haphazard approach. It's the reason machine learning startups are
doomed to fail unless they take a step back and start by identifying a
real problem to solve first.

And just like databases and the internet were exciting technologies in
the past, machine learning and blockchain are exciting technologies of
the present. But a technology in itself isn't a business. Solving a
problem is a business. And when trying to solve problems, technology
can help you a great deal.

Think about it - can you think of any "We build something cool with
Internet Technology" startup which survived the dot-com bubble? How
about "Database Technology" startups in the decade before that?

No. We must start by identifying problems and only then are we allowed
to look around for great technology to solve it with.

Great quote on this topic from a guy at Apple:

> And, one of the things I've always found is that you've got to start
> with the customer experience and work backwards for the
> technology. You can't start with the technology and try to figure
> out where you're going to try to sell it. And I made this mistake
> probably more than anybody else in this room. And I got the scar
> tissue to prove it.

*(Steve Jobs, 1997)*

Armed with Steve Jobs wisdom, how do we fix my smart home problem?
Three steps.

 1. **Forget the technology for a moment:** Power down the raspberry pi.
 2. **Observe:** Observe what I do at home.
 3. **Identify problems:** Identify things which are problematic and/or
    repetitive.

Perhaps these steps could be even more generalized and would save a
startup or two out there from building products which don't solve any
real problems.

Onwards. Power down the raspberry pi. Step one complete. Step two. I
observed myself for a few days. It's crucial to do this for multiple
days to identify the repetitive things.

Step three. I identified these things which I did repeatedly:

 1. Turn lights on when I come home in the evening, setting them to
    a warm temperature and dimming them a bit.
 2. An hour before bed, dim the lights.
 3. Turn all lights off just before sleeping.
 4. Turn lights on when getting up for breakfast, setting them to a
    cold temperatue and full brightness.
 5. Turn all lights off before leaving the house.

And not only did I identify repetitive tasks, I also found some
problems:

 1. In rare cases, I forgot to switch off a light before leaving the
    house.
 2. When going on vacation, I sometimes wasn't sure whether I had
    turned all thermostats off (i.e. the heating, those knobs on the
    radiators here in Germany).

I now was armed with a list of things of problems and repetitive
actions. And I already knew of a technology which could solve it - my
raspberry pi and home assistant. If this were a business, I suppose
this would be the point at which you and your co-founder start working
like crazy.

But this was just my smart home. So I booted the raspberry pi back up
and started hacking. And once the problems I was trying to solve were
clear, writing the code suddenly became a minor task.

Let's look at my solution:

 1. I created different lighting scenes for my flat as home assistant
    scripts. "Evening lighting" (warm white, dimmed slightly), "Night
    lighting" (warm white, heavily dimmed, some bulbs off) and
    "Morning lighting" (cold white, full brightness, only in kitchen
    and bathroom). I can manually trigger these from all my devices
    via the home assistant webapp.
 2. I added a trigger which runs every time my bathroom light is
    turned on, checks the time and changes the color temperature and
    brightness accordingly. So, every time I turn the light on in my
    bathroom (it still has a switch), the color temperature adjusts
    based on the time of day. No need to fiddle with my phone.
 3. When my phone re-connects to wifi *and* it's in the evening
    *and* the sun has set, execute the lighting scene "Evening
    lighting". So this detects when I come home in the evening and
    lights up my flat even before I've reached my door.
 4. When my phone disconnects from wifi, turn all lights off. This
    assumes that I've left the house and in case I've left any lights
    on, they're turned off.
 5. Create a script which turns all thermostats to the "off" position.

Problems solved! I hope Mr. Jobs would approve. I put the customer
experience first.

And like with every great technology-based solution, I've introduced
some new problems:

 1. When I run OS updates on my phone in the evening, it reboots,
    disconnects from the wifi and.. guess what? All lights turn
    off. Recently, there was an especially hilarious situation where I
    turned my phone off to carefully put on a new screen protector. I
    turned my phone off for that. Just as I was about to lower the
    sticky side onto the display, my flat went dark.
 2. If I take a nap in the evening and switch my phone to airplane
    mode and later turn it back on, all lights go on. This startled me
    as I was expecting to slowly wake up by turning only my bedroom
    lights on.
 3. When trying to clean my bathroom in the evening, I need some
    bright light. But it always sets itself to dim, warm light because
    it's in the evening. So I have to disable the trigger which
    adjusts its color temperature. It's funny when you start battling
    your own home automation.

This was a fun and instructive experience. I wouldn't have expected to
be forced to identify and solve real problems before diving deep into
technology. And I'm sure certain aspects of my experience generalize
well to building great products.


<!-- Links -->
[home assistant]: https://www.home-assistant.io
