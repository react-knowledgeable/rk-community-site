---
speaker: wei
title: Recap RK Lightning 2
date: 2019-09-10
---

Last Thursday, we had our second ever RK Lightning event at [HackerspaceSG](https://hackerspace.sg/) 🎉. Here's Wei's recap 👩🏻‍🌾

<!-- excerpt ends -->


## Talks

### 💄 Build a Gatsby Theme and publish [#13](https://github.com/react-knowledgeable/react-knowledgeable-talks/issues/13)

[Raj](https://mobile.twitter.com/email2vimalraj) kicked off the lightning talks with his second live demo with Gatsby, this time building a [Gatsby Theme](https://www.gatsbyjs.org/docs/themes/what-are-gatsby-themes/) of a site with a like button. What is your one liner for Gatsby Themes? Secretly, I call them partials. After last Thursday's talk, I think of them as a way to communicate with common features via a version number now.

`twitter: https://twitter.com/reknowledgeable/status/1169578211249815552?s=20`

- [slides](https://github.com/email2vimalraj/gatsby-theme-like-post/blob/master/build-gatsby-theme-talk.key)
- [demo](https://github.com/email2vimalraj/gatsby-theme-like-post)
- [video](https://engineers.sg/v/3638)

### 👞 Dancing with React Hooks [#2](https://github.com/react-knowledgeable/react-knowledgeable-talks/issues/2)

Next, we had our most magical [Van](https://mobile.twitter.com/bokukage) to talk about what she learned about hooks by creating those little dancers with funny walk moves on the screen. Joyfully surprising everybody she demoed the moon walk 😂 The characters she created in her stage has exactly her style and that leads to her other talk at [SingaporeCSS](https://singaporecss.github.io/), [The Joy of Doing Things without the Need for Justification](https://smokinclove.github.io/the-joy-of-doing-things-without-the-need-for-justification/) - (oh look at her newest avatar, it has her MJ hat now!) For this day, she then dived into what she learned about hooks, how to make setInterval and useEffect have peace, her take on understanding hooks.

`twitter: https://twitter.com/reknowledgeable/status/1169582223726501889`

- [slides](https://docs.google.com/presentation/d/1mrGSHBNYoUlMYrOWZ6BMiJ4rCvfJqIq1XgTuPkePkkM/edit?usp=sharing)
- [video](https://engineers.sg/video/dancing-with-react-hooks-react-knowledgeable--3637)

We took a question break. I had a nice conversation with [Yangshun](https://twitter.com/yangshunz), who has me for [Docusaurus](https://docusaurus.io/) but it was actually the first time we met in person! The question break also features popcorns popped by Valentine from Hackerspace our host. And stickers exchange!

### 🦖 How Modern Static Site Generators Work [#11](https://github.com/react-knowledgeable/react-knowledgeable-talks/issues/11)

[Yangshun](https://twitter.com/yangshunz) talked about how modern static site generators are built. They share some intrinsic similarities with each other, and they differ from traditional ones. It seems that Yangshun has learned those by building [Docusaurus 2](https://docusaurus-2.netlify.com/) 😉

- [slides](https://github.com/react-knowledgeable/react-knowledgeable-talks/files/3584661/React.Knowledgeable.-.How.Modern.Static.Site.Generators.Work.pdf)
- video (to be updated)

`twitter: https://twitter.com/reknowledgeable/status/1169587281411207169?s=20` 

### 👥 Are React and CSS Friends? [#14]

Then, I shared about styling sites with React, how React changes the way we write styles, and a mind model that makes sense for me to style my projects, including [our site](https://reactknowledgeable.org/).

- [slides](https://uuei.io/talks/cream-pencil-crayon/)
- [video](https://engineers.sg/v/3640)

Then finally, Thomas took up the last spot (15 mins before 9!) and shared about a problem he encountered at work – communicating styles between page and iframe embedded modal.

- [video](https://engineers.sg/v/3639)

All videos are courtesy of the worldclassly [engineers.sg](https://engineers.sg/), [we will never stop getting amazed](https://twitter.com/swyx/status/1169640745604714496?s=20)

### 🤞 Till next time

Our night snack was indian food at ABC, fun promised, our tables were tilted this time!

RK is a fun and friendly podium to share what we learn about React. The best way to participate is to [speak at RK](https://github.com/react-knowledgeable/react-knowledgeable-talks/issues), share with us what is sparkling interesting to you. Hope to _hear from_ you next month!

`twitter: https://twitter.com/wgao19/status/1169636723573190656?s=20`

## React updates of the month

### ⚛️ [React 16.9 is out](https://reactjs.org/blog/2019/08/08/react-v16.9.0.html)

- more UNSAFE_ lifecycle methods
- deprecated unheardof stuff
- acync act() for testing
- Performance Measurements with <React.Profiler>
- need to wait longer for a combined release of concurrent mode + suspense for data 
fetching `¯\_(ツ)_/¯` i am not even surprised

### 🛠 [New DevTools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html) 

- [changelog](https://github.com/facebook/react/blob/master/packages/react-devtools/CHANGELOG.md#400-august-15-2019)
- [interactive tutorial](https://react-devtools-tutorial.now.sh/)

My friend Nut doesn't like it because it no longer has the very reactive re-render component highlight. Although the "why my component rerenders" under profiler tab looks really shiok.

### 🥯 Flow v0.106 [Coming Soon: Changes to Object Spreads](https://medium.com/flow-type/coming-soon-changes-to-object-spreads-73204aef84e1)

- the current model is based on an assumption that inexact object types do not specify own-ness, this makes properties from spread become optional because object spread at run time copies only _own_ properties
- the new model assumes inexact object types specify own-ness on specified properties, therefore following our intuition of object spread more closely
- inexact objects _may_ contain more properties that may overwrite existing properties in spread target
- the new model will err, tell us what happens, and ask if we can make the spreaded object exact

I got involved with a twitter thread the other day. There was some voice saying Flow is dead. Flow is _not_ dead my lovely people :) Flow is happily wedded with React. They live under the same household, and guess who gets to officially [support React v16.9 Profiler](https://github.com/facebook/flow/blob/master/tests/react_16_9/profiler.js) first?