---
layout: post
title: The Correlation Project
date: 2018-09-29 20:00:00
disqus: y
---

As a coder, concentration and mental focus become very
important. Writing code is a very brain-intense activity which makes
daily fluctuations of mental focus very obvious.

I already noticed this while studying medicine. Luckily, studying
medicine is not an activity which requires a lot of brain activity
(it's more about being organised). When I started working as a
software engineer however, this became more important.

## Side note: There's a talk

I gave [a talk][clojutre-talk] about this at [ClojuTRE
2018][clojutre-talk] in which I summarized the whole concept and my
findings in 20 minutes. Of course, there wasn't enough time to talk
about everything - that's what this post is for.

## Medical Considerations

On a practical level, I wanted to be able to rate my mental focus
quickly and in a way which reflects how I feel when I leave the house
in the morning. At this time I usually get a good feeling for whether
it's going to be a good or bad day concentration-wise.

Thinking a bit more about this, I came up with the idea of rating
*Brain Fog* which for me is more or less the opposite of mental
focus. [Chris][chris-github] and I had done something very similar for
masturbation already (long story) in which we wanted to correlate
masturbation habits with mood, energy and libido in the days
thereafter. At the time we decided to make users enter that data on a
scale of 1 to 5 which proved quite usable. So I decided to adapt this
slightly this time and choose a scale of 0 to 5 for "subjective Brain
Fog".

Apart from that, I didn't put much work into medical
considerations. That probably wasn't very wise. I did however consider
[coeliac disease][coeliac-disease] as a potential culprit even though
I thought it would be unlikely in my case. My data however should be
sufficient enough to prove this, right?

## Engineering Considerations

This being a side project and me being a software engineer, I had the
obvious tendency to overengineer everything to be able to try out all
new technologies at the same time. Let's write a backend in Clojure!
Perfect opportunity to try out GraphQL! Let's make the frontend a
progressive web app with offline-first capabilities!

Well, that didn't happen. Turns out I have a full-time job at Merantix
and need to take care of some other aspects of my life in my spare
time (sleeping, eating, brushing teeth).

Reflecting upon this, it became clear that I didn't even know the
structure of my data yet: What sort of data is a meal? What about an
activity like going to the gym? How do I measure my mental focus? On
which scale? How often?

As a software engineer, this is a great opportunity to put your
engineering pride behind you and use Google Sheets.

## Google Sheets

Google Sheets is the unsung hero of prototyping data-driven
ideas. Contrast the following things to Postgres:

Want to move around some data? It's as easy as marking some cells and
copy-pasting them around.

Want to rename some columns and change their data type? Just rename
them, don't bother about the data type.

Want to enter some data from your phone? No problem, download the
Google Sheets app and start typing. Syncing included.

Of course, there are drawbacks, too. No data validation being one of
them. You accrue technical debt by having to parse the data later on
(everything will be a string) but for this purpose the benefits
outweigh the drawbacks.

## Data Structure

I decided on a fairly simple data structure. Everything is an
*event*. An event has four fields:

 * datetime (datetime string)
 * category (string)
 * event (string)
 * value (number, can be empty)

The *datetime* is the time of the event. Cool trick: In Google Sheets
(on macOS), you can enter the current datetime by selecting a cell and
pressing <kbd>⌘</kbd>+<kbd>Option</kbd>+<kbd>Shift</kbd>+<kbd>;</kbd>.

The *category* would be something like `food`, `activity`, etc.

The *event* describes what actually happened. For example `gym` or
`rice`. I'll get back to that later.

The *value* is a number (float or integer) in case the *event* was
something measurable. For example, a `weight` event could have my
weight in kg as a *value*. This value is optional.

### Example

Check out this example in which I enter some data:

![Entering data into Google Sheets][google-sheets]

## Types of Data

### Brain Fog, Extroversion, Libido

I recorded these three parameters on a subjective scale of 0 to 5. I
came up with the choice of these parameters because they were the ones
which I noticed the most and also which changed quite a bit.

#### Brain Fog

Defined by the question: "How foggy / unconcentrated do you feel right
now?".

#### Extroversion

A measure of how extroverted I'd feel. More specifically, trying to
measure my openness of doing things which cost social "energy",
e.g. talking to someone new, going to an event (e.g. a Clojure meetup)
or working from a random coffee shop.

#### Libido

Pretty obvious. The minimum of libido is defined as "I don't care
whatsoever" whereas the maximum is pretty much "I care a lot because I
can't think straight".

### Poop

Also, I kept track of every time I had a, let's say, a significant
deployment event on the toilet. I even rated it on the [Bristol stool
scale][bristol-stool-scale]! As a great side effect, I now know the
Bristol stool scale by heart.

The idea here was that maybe I would be able to predict the type of my
stool. How cool is that. So useful.

### Google Fit

You remember those Sundays when you don't leave the house and then
feel kinda sluggish the whole day? I had this theory that leaving the
house and walking around would be beneficial by reducing Brain
Fog. Luckily, Google had already been recording my location history of
the past two years (thanks!) and the Google Fit data even includes the
step count every few minutes or so.

Fetching Google Fit data is surprisingly easy via [Google
Takeout][google-takeout]. You end up with some CSVs. I wrote a
[parser][google-fit-parser] to import the data.

### Emfit QS

Thinking back to those Sundays, I often tend to sleep unreasonably
long. I didn't want to buy a smart watch and tracking sleep accurately
without a smartwatch is actually not that easy. Finally, I decided
this would be a great excuse to buy the Emfit QS which is a sleep
tracker which you put under your mattress (!).

It continuously measures you heart rate, respiratory rate and
movements. Of course, it also calculates your sleep duration. And
guess what, you can also export the data as CSVs! I wrote [another
parser][emfit-qs-parser] for that.

## Analysis

Analyzing time series data is non-trivial; the two weeks of statistics
I had in medical school were definitely not sufficient for that (nope,
doctors don't have much education in statistics).

I coincidentally came across this [weight-loss][weight-loss] project
on GitHub via Hacker News. The approach was simple, but really clever:
He would write down his weight and what he did the last day in
keywords. This would mostly include food types and sleep habits.

Then, he would fit a machine learning model (vowpal-wabbit, basically
a type SVM) on this data with the goal of predicting his daily weight
changes based on what he did on the prior day.

Finally, he would output the weights of the model, specifically the
weight of each of the keywords (food, sleep habits etc.). Then he
would end up with a list of factors where he could see which factors
are correlated with weight loss vs. which factors are correlated with
weight gain. Definitely check out [the repository][weight-loss] for
some cool figures!

### Vowpal-Wabbit

My idea was to use the same approach with some minor modifications:
Firstly, I would not have a fixed time window like in the weight loss
project - there, it was always about 24 hours as only the prior day
was taken into account for each weight measurement. Instead, I would
be able to define different time windows and see if this changes my
results.

Secondly, I wasn't interested in my weight but in other things. I
would run separate analyses of all the parameters I had been recording
(brain fog, extroversion, libido, poop score). That means that I would
have to run multiple analyses.

#### Vowpal-Wabbit Results

Turns out, it didn't work. For Brain Fog, I would get a training
accuracy of only 0.3 which is better than guessing (0.16) but really
not all that good. The training accuracy of the other parameters
(including poop) turned out to be similar.

### Simple Correlations: Reviving the Incanter

I decided I had to take a step back. I was just stupidly feeding data
into Vowpal-Wabbit in the naive hope that some magical result would
come out. In the case of the weight-loss repo, that turned out to be
the case. In my case, not so much.

An important aspect of data science is actually getting a feel for
your data. This includes plotting some things. Just "plotting some
things" in Clojure is however not something which people do very
often. People nowadays use Python for Data Science (why?) so most
well-maintained, fully-featured packages are in that ecosystem.

There is however a hidden old gem to be found: The
[Incanter][incanter] project. In the old ages of Clojure, this was a
promising and active project. Sadly it's hardly maintained
nowadays. The good news is that 1) Clojure's backward compatibility is
fantastic and 2) Incanter's API is easy to understand.

Plotting some things is actually really straightforward. Ironically,
it's probably easier to plot things with Clojure and Incanter than
with a Jupyter Notebook and matplotlib. Having a simple, functional
API is much more developer-friendly than the concoction of
MATLAB-inspired, mutable-state *things* of matplotlib.

#### Simple Correlation Results

I couldn't shake the feeling that my sleep was a central factor in
causing my Brain Fog. I therefore correlated values of the Emfit QS
for each night with my Brain Fog the next day. There are lots of
values which are provided: Total sleep duration, duration in REM
sleep, duration awake (but in bed), and count of awakenings just to
name a few. While correlating all these values with my Brain Fog, I
had to think of [this xkcd][xkcd-multiple-testing] about multiple
testing.

Interestingly, the total sleep duration correlated with my Brain Fog -
*positively*! That means that the longer I sleep each night, the higher
my Brain Fog would be the next morning.

This is quite puzzling.

From intuition, longer sleep should actually correlate *negatively*
with Brain Fog, right? The longer you sleep, the more focused you're
going to be the next morning and the less Brain Fog you're going to
have, right? That didn't seem to be the case.

One of the reasons may be that I didn't have a broad range of sleeping
durations - the range was between 6 and 10 hours. I could imagine the
curve to actually be U-shaped - high Brain Fog for very little sleep
(say, 0 to 4 hours), low Brain Fog for intermediate sleep durations (4
to 7 hours) and high Brain Fog for long sleep (7+ hours). But I'm just
guessing here.

More interstingly, the correlation was even stronger for duration
spent awake in bed. That again makes sense: I remember those Sunday
mornings when I'd hang around in bed for ages just to get up and feel
groggy the whole day.

## Conclusion

Even though I didn't come away with a clear result, I learned a lot of
things.

Firstly, it's not necessarily a good idea just to collect a large
amount of data and whip it into a Machine Learning model and hope that
interesting results emerge from it. Even though we live in the age of
Machine Learning, this still doesn't spare us from putting thought
into what we want to investigate and what type of data we want to
collect.

Secondly, doing these sort of medical studies, you should always
prefer objective values over subjective ones. This may sound obvious,
but it's not: I was measuring Brain Fog on a subjective scale from 0
to 5 and only later switched to a more objective concentration test
(Stroop Test).

Thirdly, doing Data Science in Clojure is hard. It's a truly great
language (and it continues to undoubtedly be my language of choice)
but Data Science and Machine Learning are fields which are
particularly dependency-heavy. You really don't want to implement your
own plotting library or SVM for a small side project. So while the
preprocessing is great in Clojure and arguably faster than in Python
(both in development and execution), the analysis is more frustrating
and takes more time.

Finally, I really don't get a lot of fun out of Data Science. Compared
to building tangible things like web apps, this feels so unrewarding.

That notwithstanding, it actually piqued my interest for this whole
medical self-optimization field. Follow-up experiments are already
underway. Stay tuned.


<!-- images -->
[google-sheets]: /images/google_sheets.gif

<!-- links -->
[clojutre-talk]: https://www.youtube.com/watch?v=jpFveXUe65I
[chris-github]: https://github.com/HerrFolgreich?tab=overview&from=2018-08-01&to=2018-08-31
[coeliac-disease]: https://en.wikipedia.org/wiki/Coeliac_disease
[bristol-stool-scale]: https://en.wikipedia.org/wiki/Bristol_stool_scale
[google-takeout]: https://takeout.google.com
[google-fit-parser]: https://github.com/olieidel/correlate/blob/master/src/correlate/google_fit.clj
[emfit-qs-parser]: https://github.com/olieidel/correlate/blob/master/src/correlate/emfit_qs.clj
[weight-loss]: https://github.com/arielf/weight-loss
[incanter]: https://github.com/incanter/incanter
[xkcd-multiple-testing]: https://xkcd.com/882/
