---
layout: post
title: The (Un-)Natural Progression of Machine Learning
date: 2019-11-10 12:00:00
---

Machine Learning is everywhere. Unfortunately. Most industries aren't
ready for it.

We tend to ignore the natural progression of software. To illustrate
this, let's look at an example: Written communication.

In the beginning, there was no software. There were only paper
letters, typed on a type writer and sent off via snail
mail. Communicating was slow. Its data was very much unstructured;
there's no way you could do full-text search on a bundle of letters.
This is phase one: No software and unstructured data.

Then came software. In this case, the internet. Suddenly, we were able
to communicate with other people. However, this was quite
unstandardized: Those early internet enthusiasts would roll their own
solutions. This is phase two: Crappy software and unstructured data.

The next improvement is straightforward: Better software. A common
side-effect of better software is that its underlying data becomes
more structured. Nowadays, have settled on email clients using POP3,
SMTP and IMAP. This is phase three: Good software and structured data.

Once our software is good and our data structured, there's pretty much
only one thing left to do: Leverage that structured data for optimizing
repetitive tasks. Like, filtering spam email. This is phase four: Good
software, structured data and incremental improvements enabled by
structured data.

This is where machine learning often comes in. Solving these sorts of
problems can be quite hard. And solving them must be worthwhile, there
must be a pressing need. Losing vast amounts of time sorting out spam
e-mails certainly is one.

Whether using machine learning or other techniques, developing a spam
filter has two simple requirements:

 1. Structured, labelled historic data must be available
 2. Present and future data must arrive in the same structure so that
    the model can be applied.

If only historic data is available (1 fulfilled) but present data
remains unstructured (2 unfulfilled), we can publish a nice research
paper which doesn't have any real-world implications, like many
machine learning papers nowadays.

If no historic data is available (1 unfulfilled) but present data
arrives in good structure (2 fulfilled), we have to compensate for
missing historic training data by creating a labelled dataset
ourselves. That's what most machine learning startups do nowadays.

And if both of those requirements aren't satisfied, we shouldn't even
consider tackling the problem.

So the natural progression of software towards machine learning looks
like this:

 1. No software, unstructured data
 2. Crappy software, unstructured data
 3. Good software, structured data
 4. Good software, structured data, with incremental improvements
    enabled by structured data

And there lies the problem. Each step is an improvement on top of the
prior one. And each step only delivers value if the prior one was
executed well.

Following this logic, any industry ready for *disruption through
machine learning* must necessarily be in phase three. In my opinion,
that's unfortunately not the case.

Most industries are nowhere near phase three. Despite this fact,
tragically, with all the machine learning hype nowadays, many startups
attempt to enter them nonetheless. They try to skip phase three, and
sometimes even phase two. That's dangerous.

Take healthcare. *Let's apply deep learning to patient's medical
records!* There's a *minor* problem though: The healthcare industry is
mostly in phase two - there's crappy software and tons of unstructured
medical data. Believe me, I've seen it. In some lesser-developed
countries like Germany, it's even worse as many institutions are still
in phase one, using paper charts instead of computers.

Or radiology, the subset of healthcare which does imaging. Images are
stored digitally in a structured, standardized format (DICOM). This
puts it in phase three. But each image is associated with a doctor's
report in which he notes his findings. Those are neither structured
nor standardized - they're unstructured free text walled off by
proprietary interfaces, phase two.

Now, it's not impossible to build a machine learning startup on top of
that, but your options are limited: You could only process images as
those are in phase three, but you'd have a hard time accessing
clinical information from doctor's reports. And you'd have to label
those images yourself.

Once your model is trained and your product is done, it'll be tricky
to put into production because you have to manually integrate it with
the hospital's systems. Compare that to integrating your spam filter
with a POP3 server.

Startups seem to have an inherent tendency to imitate Google. The most
recently imitation is using machine learning.

Google has a solid search engine with structured data - that's phase
three. Now it has applied machine learning to that (phase four),
yielding incremental improvements which translate to millions of
additional revenue. Just imagine improving adwords performance by one
percent.

The naive startup then says: *Hey, if Google is applying machine
learning and earning millions, we can apply machine learning and earn
millions!* A dangerous fallacy. Surprisingly, reality hasn't caught up
with the hype yet - machine learning startups are everywhere, still.

Machine learning is only a tool, and any tool by itself is useless. It
needs solid software and structured data in production. Then, and only
then, can it provide value - and in all likelihood, that value will be
incremental.
