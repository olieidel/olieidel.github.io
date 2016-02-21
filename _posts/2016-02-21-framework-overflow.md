---
layout: post
title: Framework Overflow
date: 2016-02-21 12:00:00
disqus: y
---

Sometimes I miss the old days in which you could simply yank out a bad PHP script interspersed with some HTML and - bezonga - you had a website. Since then, things have become somewhat more complicated.

Sure, I could still use the old approach but that would be like stealing the Wright Brother's airplane and trying to cross the Atlantic with it. It might not work very well. It might not scale. It's sort of outdated. It might crash. People might laugh at you. It looks hopelessly outdated in a modern world.

Instead, I'd like to choose a more modern option. Awesome! Where to start? So let's try React. Okay, we'll have to learn some JavaScript for that. 3 hours of learning JS at codecademy.

But wait.. what do we mean by learning JS? So there's "Vanilla" JS. Then there's ES6 (or wait, do we call it ES2015?). Oh, and ES7 is also lurking around the corner. 1 more hour spent understanding the syntax differences in ES6.

Oh, are we targeting the Client or the Server? We might have to learn some node-specific stuff, too. What are those weird pipes? 3 more hours for the node tutorial "for beginners". It's still weird. Who invented this stuff?

Anyway. Done learning JS? Start learning React. React is obviously based on JS, but it's concepts are not that easily understood, so you can't just pick it up "on the go" like you picked up SQL when you were hacking in PHP. There's state. Check out those props. Makes sense. Let's look through the official React tutorial. 3 hours gone. Wait, how do we pass data around components? There seems to be something missing. We can only pass data "downwards" to children, how about the other way round?

Oh, interesting, there's flux for the rescue. Oh wait, flux is just a concept, but there are different and varying implementations. Let's look at Redux. Oh, another framework. At least we know JS and React now, so picking Redux up should be doable in short amount of time... Oh, there are quite a few talks on Youtube about flux...

4 hours later. Got it. Forgot to mention that React syntax can look gruelingly different depending on how progressive the author feels. There's ES6 "module"-style syntax. There's oldschool `React.createClass()` stuff. Some weirdly modern functional voodoo on the horizon. Whatever. Lost another hour.

Okay, focus. What was my goal again? Right, building a website. Let's start a project, that's the best way to learn, right? Where to start. Just creating an index.php won't work this time. Oh, check out these Boilerplates. Some caring people made a nice effort in creating those for us.

Wait, server-side rendering? For React? What's that. Wow, that's one hell of a Boilerplate. Can't afford to lose more time. How about I skip server-side rendering for the moment. This is going nowhere.

Oh, awesome, found another Boilerplate without server-side rendering. Nice. Wow, so many scripts. A Server? I just wanted to write a client, damn it. Oh okay, the server actually only is for local development and does this neat live-refresh thingy while I'm coding. That's awesome, I approve. Wait, what's Webpack?

Oh no, I get it. Another bling-bling type of JS Laser Thing, which makes everything awesome, easy and non-blocking. Whatever. I just want to get started. But I should understand the scripts in this Boilerplate first.

1 day later. Bootstrap is awesome, it saves me time by reducing all that CSS pain. Let's see, how do I import it into my project? I could download the minified CSS, but I don't want it minified, I want to customize it later. Duh, what's this LESS and SCSS thing now?

Some hours later. Okay, so SCSS seems to be the next big CSS thing and LESS is also awesome, but not as cool. Bootstrap can be downloaded in either language. However, the upcoming Bootstrap 4 chooses SCSS so it must be more awesome. Let's import Bootstrap's SCSS stylesheets into our Webpack project.

Yes I already guessed it. It's not as easy as `<link rel stylesheet=.. />`, that would be too easy! Instead, let's "quickly" dive into Webpack's Documentation. Quick, right?

Hm, so most tutorials are using gulp or grunt. Wtf? Now what's the difference between gulp, grunt and Webpack? Let's lose some more time.

Okay, whatever. Sticking with Webpack. Ah, got it! I need node-sass and sass-loader. Then some weird regex haxx and it should work. Obviously, it doesn't work. Have to import the base scss file somewhere. Got it. That was fast, just an hour. Done!

Now, onto the Backend. There's node. Express. Wow, Loopback has it all included. Or go oldschool? Django? Flask? Rails? Sinatra?

Oh, check out Meteor. It's all there. Websockets, Backend and Frontend in one directory. Nice. ES6 syntax works, but import statements don't? Can't browserify ES6 modules? Oh wait, it has an own package "Atmosphere"? How about Redux? Or rather use the included `Session`? What about those Promises? It uses Fibers, but I'm more a Bluebird sort of person. Or just `Meteor.wrapAsync`, which seems like the easy way out.

Ah, what's this MongoDB? ...

... To be continued

---

Honorable mention: It took me 3 hours to fix this Jekyll blog due to GitHub changing the markdown highlighter to kramdown (I was on redcarpet) and syntax highlighter to rouge (I was on pygments). Easy Peasy. Yeah, first a "quick dive" into the kramdown and rouge documentation. Then triaging the cause with Chrome Dev Tools. Seems to be a simple css issue. Should be fixed with some class name changes, quick fix, right? Oh yeah, I forgot that I merged some upstream theme changes which hardcoded absolute URLs in the `<head>`, therefore loading the published css from github.io instead of my local, modified copy. No worries. Found it after an hour.
