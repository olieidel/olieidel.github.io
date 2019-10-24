---
layout: post
title: The Rush of Shipping
date: 2019-10-14 12:00:00
disqus: y
---

Recently, one of my posts made Hacker News #1. That brought back
childhood memories.

## The Paidmail Site

When I was thirteen, I launched a hacky *Paidmail* site. The concept
was simple: You signed up to receive ad e-mails. At the end of the
month, you got money in proportion to how many e-mails you had
received.

How did I build it? I didn't. I used a crappy PHP project I had found
somewhere.

It even included a referral system: If someone signed up through your
link, you'd earn 10% of what they earn - forever.  The referral system
even went five layers deep, seriously. That meant if person 1 signs up
through your referral link and person 2 signs up through person 1's
link, you'd be getting a cut of both person 1 and 2's earnings. Up to
person 5. I didn't think much about it.

My coding skills were bad, but my design skills were worse. I couldn't
even write CSS. I used some crappy HTML template I found somewhere.
Remember, this was the 2000s. So basing your "design" on a free HTML
template would easily place you in the top 40% of well-designed
websites. Good times.

It didn't even have a domain. Remember, I was thirteen, so I only had
one domain which was registered on my father's name, running on his
bank account. Getting another domain would be just as complex. So I
created a subdomain on that domain for my Paidmail site. This was
quite funny because the root domain was about building websites,
totally unrelated to e-mails and earning money.

## The Launch

I was active on an online forum, a good old phpBB, on how to make
money online. There was a subforum for people announcing their new
projects. I created a new thread and launched my Paidmail site.

This was not the first thing I launched. That same community had a
now-forgotten point system. Those points were somewhat of a virtual
currency. They had an API for transferring them. Based on that, I had
coded up a few gambling sites before. Really simple stuff. Like "bet
whether the coin flip will be heads or tails". Unsurprisingly, none of
them were a huge success.

After launching my new Paidmail service, I went to bed. The next
morning, I went to school. After school, a friend came by. When he
left, it occured to me that I had launched *this thing* last night. I
checked the registration count: *68*.

Wait, what? *68 people* registered in the past 24 hours? I logged into
the MySQL DB to check. They were real.

Turns out, the referral system was a good idea - by coincidence. As I
learned later, there was this community of people who were really into
being the first to register on Paidmail sites to promote them with
their referral link.

The following weeks, hundreds of registrations poured in and plateaued
at around a thousand.

Those days were spent scrambling: Trying to find people, customers,
who were willing to pay for sending ad e-mails to my users. This
turned out to be difficult, but I found a few.

Also, figuring out performance issues. Turns out, it's non-trivial to
blast an e-mail to hundreds of people in PHP, on a shared server, in
one blocking call, with no way to re-start it if it crashes.

When the first user accounts were close to the minimum payout amount,
I tested the payout mechanism. I logged in with my user account and
clicked "Payout". *404.* It didn't exist. That happens if you launch a
business based on random PHP files you found on the internet.

More scrambling. I wrote a simple PHP form which would send me an
e-mail with details of the user who wanted his money. That was
actually some of the first code I'd written, ever. And I already knew
it wouldn't scale, ever. But it would work. For now.

User complaints came pouring in. Some received e-mails twice because
PHP crashed during sending them. *Fixed. Won't happen again.* Others
wanted their money but only got a 404 page. *Done. Refresh and find
the form.*

For every thing I coded, there were users out there who were
desperately waiting and immeasurably grateful when they realized that
they were heard. Knowing that somewhere else in out there, there was
some half-asian guy, sitting behind a CRT screen and solving their
problems by writing really bad PHP code. And for me, it was one of the
most satisfying times in my life.

*The Rush of Shipping.*

Knowing that what you're working on is *the right thing*, because it's
obvious and it's obvious that people want it. Shipping something to
production which will be used just minutes later. And knowing that
it's *yours*, you solved their problem and you know it's right.

Waking up in the morning, firing up the computer to see who signed up
last night. Ready to code, knowing exactly *what's next*. Because it's
obvious.

---

I consider myself very fortunate for having experienced this
feeling. Because I think most startup founders haven't. They follow
the usual path: They conceive of an idea, get some money, retreat to
their cave, build their product for a year, launch, don't gain any
traction and finally retreat into darkness.

At no stage in this process did they have customers waiting for them,
hyped, eager to see *what's next*. They either didn't have any
customers in the first place or their product was so useless that
nobody cared *what's next*.

They never experienced *The Rush of Shipping*.

We allow people to tread on the wrong path for way too
long. Developing enterprise applications which are too complex for
anyone to ever use. Working 12-hour startup days on products that
never ship. Solving problems which are fascinating, but only on a
technical level, for the same people who are working on them, and for
nobody else.

Developing software is hard. Developing the right thing is even
harder. And only a very few of us have experienced how it feels to
solve the right problems, for the right customers, with the right
technology. *The Rush of Shipping*.

Every developer should know how this feels.

---

It's been a long time since I've had that feeling. After the Paidmail
episode, I ran the site for a year or so. At some stage, the users
noticed they wouldn't become rich and lost interest in receiving
e-mails. Then, the customers lost interest in purchasing e-mails, and
finally, I lost interest in everything. I forgot how it felt.

Until recently, 16 years later. I had been writing more frequently and
then one of my posts reached Hacker News #1.

I didn't even notice at first. On my way to bed, I checked HN once
more, when I saw something familiar at the top of the list. It was my
site.

People poured in. And then, e-mails. Whether there's an RSS/Atom
feed. Uh, no. Whether you can subscribe via e-mail. Um, not really.

And there it was again.

For the RSS/Atom feed, it's a one-liner for GitHub pages. For
newsletters, there's Mailchimp.

It may not seem like much; but this is not about the size of features
nor their complexity. It's about that feeling that out there, there's
someone, waiting for you to build it. And you know it. That's *The
Rush of Shipping*.
