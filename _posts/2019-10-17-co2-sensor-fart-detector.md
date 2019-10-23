---
layout: post
title: I Wanted a CO2 Sensor, I Got a Fart Detector
date: 2019-10-17 12:00:00
disqus: y
---

In the everlasting quest of optimizing my sleep, I recently started
measuring air quality in my bedroom. I hope to write up the setup at a
later time; here, I'll focus on some surprising results.

I used a sensor to measure equivalent CO2 (eCO2) and Total Volatile
Organic Compounds (TVOC).

## The Morning Spike

The first surprise came when I left the house. While having lunch at
work, I quickly checked the sensor readings. There had been a huge
spike in the morning - more than 12.000 ppm! Insane! How could that
happen? Secret flatmates? A zombie invasion? Surely, there must have
been a mistake.

The next day at noon, I checked again. Another crazy spike had
occured. The next morning again. And the next.

Huh. The spike always happened between 8 and 10am. Wait, that's always
the time I get ready for work - or, not quite - that's the time I
leave my flat. So what do I do just before I leave my flat? Something
which emits.. volatile organic compounds?

No, this wasn't about me doing a number two ("deploying"). Although
that was one of my theories. It turned out to be my deodorant.

So, any time I'd leave the house I'd use deodorant spray. For some
reason, this drastically lowers gas resistance which results in a
false-high reading of eCO2 (and probably a true-high reading of
TVOC). Hair spray also triggers it.

I moved on to test this hypothesis by not using those sprays in my
bathroom but instead outside on my balcony. That was quite
awkward. Imagine spotting a half-asian guy, sleepily walking out in
jogging trousers onto his balcony and spraying himself with things,
then casually walking back in.

What causes the high readings on the sensors? I'm not sure whether
it's the organic "smell" part or the gas itself (butane?). My bet is
on the smell. Read on to learn why.

[![Getting ready in the morning. Spray spike at 9:38am][spray]][spray]

*Getting ready in the morning. Spray spike at 9:38 am*

## The Other Morning Spike

Some days, there was another spike in the morning. But this one
happened earlier.

Discovering this was fun. In woke up one morning and reached for my
phone to check the CO2 values of the night (what else?). While moving
under the duvet, I got reminded of yesterday's lunch. You must know, I
frequently go to the Indian place next door with my colleague
[Narendra][narendra]. As you may have guessed, a plume of toxic fumes
wafted out which had been trapped there the entire night.

After regaining consciousness, I focused on my phone again. The graph
of both eCO2 and TVOC was shooting upwards! Insane. It was detecting
my accumulated farts in real-time.

[![Not quite a starry night, rather a farty night. Check out those
peaks.][farty-night]][farty-night]

*Not quite a starry night, rather a farty night. Check out those
peaks.*

## Measuring What I Actually Wanted To Measure

Apart from these distractions, what did I actually want to measure?
This turned out to be surprisingly hard because I'm not sure if the
sensor was really accurate.

When I'm not home, nothing in my flat should be emitting CO2,
therefore the values should be stable. Turns out, they're weren't. I
don't know why.

There seems to be some day/night periodicity in there but I can't
figure out what it is. It could have to do with the humidity
compensation of the sensor. Or, temperature. Or, the traffic of cars
on my street even though my windows are closed? Or, my plants jumping
out of their pots and having a party?

[![Not at home. Is there a party going on at my
place?][not-at-home]][not-at-home]

*Not at home. Is there a party going on at my place?*

There's also this other phenomenon that, with open windows, eCO2
levels are at 400ppm (the minimum the sensor can measure). That makes
sense. As soon as I close the window, values rapidly jump up to
1.000ppm for no apparent reason. And then, during the next few hours,
they don't rise linearly but instead plateau somewhere at 1.5k or 2k,
but never really at the same value. This can also be seen on the fart
graph above, if you ignore the peaks.

There's surely a lot more about measuring CO2 which I have yet to
learn.

---

# Update

A few more interesting findings which I'd like to share.

## A Normal Night

Some nights are actually just as I would have expected them to be: An
almost linearly rising value of eCO2. The graph below shows a night in
which I left by bedroom door open which increased the total "connected
room volume" considerably as it now included my hallway and kitchen.

During this night, values peaked at 2.5k ppm. That's concerning
because, apparently, drowsiness can already be experienced at 1k; at
2k, it gets even worse: Loss of cognitive function can occur, often
accompanied by other complaints like headaches.

[![A Normal Night][normal]][normal]

*A normal night.*

## A Night With Bedroom Doors Closed vs. Tilting a Window

I usually keep my bedroom door open. But recently, friends came to
visite me for the weekend which made me close it for the night. My
bedroom is rather small so it would be very interesting to see whether
this had a measurable impact.

The results are staggering (left side of graph). Ignoring the peaks /
farts, eCO2 values reach up to 6k ppm. That's already way beyond
significant cognitive impairment! No wonder I felt crappy the next
day.

The next night (right side of graph) my bedroom door stayed closed but
I tilted the window. eCO2 values were much lower and it didn't seem to
accumulate - which makes sense.

[![All doors closed (left) vs. tilted window
(right)][closed-room-vs-window-tilted]][closed-room-vs-window-tilted]

*All doors closed (left) vs. tilted window (right).*


<!-- Images -->

[spray]: /images/co2-sensor-spray.png
[farty-night]: /images/co2-sensor-farty-night.png
[not-at-home]: /images/co2-sensor-not-at-home.png
[normal]: /images/co2-sensor-normal.png
[closed-room-vs-window-tilted]: /images/co2-sensor-closed-room-vs-window-tilted.png


<!-- Links -->

[narendra]: https://vicarie.in
