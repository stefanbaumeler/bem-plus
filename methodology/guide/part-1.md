# Part 1: Problems with CSS

Difficulties with CSS (and if I talk about CSS here I always include SCSS as well) usually do not stem from the actual styles. Sure, there are many of them, and you have to learn them all to use CSS effectively, and yes, still to this day there are cross-browser issues with styles (looking at you Safari). But styles do not usually cause that many bugs. Because, if you set a styling, you immediately see if it has done what you want it to do. If it doesn’t, you fix it. If it does what you want, it won’t suddenly stop doing what you want. There is no logic behind styles, only facts. They define how things look like, not which things or when.

No, the difficulties usually come from selectors. Selectors define the logic, but also the structure of our CSS code.

CSS gives us a lot of freedom, and SCSS gives us even more, when it comes to structuring our code. And dealing with that freedom and all the pitfalls that come with it, is the main challenge of CSS.

In this series of posts I want to present a system that tackles that challenge, but first, we have to define what problems we are facing when writing CSS. That’s what this first post is about.

So here they are, the most common problems I faced before I invented that system, and the most common problems I am still encountering when working with other peoples’ code:

### Specificity

If you are working with scoped CSS, lucky you! You can, for the most part, ignore this section. However, there are still many of us that do not work with scoped CSS, namely anyone working in the frontend without a framework like Vue or React.

In those environments, dealing with specificity issues can be a major problem. For example, you might have a selector that is responsible for setting the state of the navigation to active. It gives its links a different color, for example. The selector looks like this: `.nav.active a`. It doesn’t work. Why? Because somewhere completely different, you have defined the base styles for a navigation link in a selector that looks like this: `.header .nav ul li a` . The specificity of this selector is higher (23) than the specificity of `.nav.active a` , which has a specificity of 21.

The only possible way to resolve this situation is to increase the specificity of your new selector. People usually pick the closest parent with a class to do this and abuse it to increase the specificity. In this case, the selector could now look like this: `.header .nav.active a`. Alternatively, you can follow the structure of the selector you are trying to override: `.nav.active ul li a`. Now the specificities of the two selectors is the same. As long as your new selector appears later in the compiled CSS code, it overrides the previous one as intended.

Selectors, as described previously, are responsible for logic and belonging. “Those styles belong to that element.”, “Those styles should only be applied if this element appears inside this other element.”

`.nav.active ul li a`, then, reads as such: “If our navigation (`.nav`) is active (`.active`), the links of that navigation (`a`) should have certain styles, _but only if they appear inside of a list (`ul li`).”_

This last, cursive part, is unnecessary. Worse, it is a condition which could later lead to confusion and even bugs. We only set it to increase the specificity, but in a month or even just in a couple days, we no longer remember that.

If we abuse selectors to fix specificity issues, forever after, we have to ask ourselves, every time we encounter any selector: “Is that condition necessary, or was it written only to increase the specificity?”

This leads to code smell: “I’d rather not touch that selector, I’d rather work around it. Who knows if it has to be exactly like this because it has to override some unknown, far away, completely unrelated selector? If I change something about it, something else might break, and I’d rather not deal with that right now.”

### Findability

Let’s say we see a link on our website. It has the wrong color and we’d like to change that. We open the dev tools of the browser of our choice and inspect the link. In the HTML structure, we can see that this is an `<a>` tag. Unfortunately for us, this element does not have a class, but the inspector tells us that the color of the link comes from a CSS selector: `.header .list li a.active`.

Now, how can we figure out, where in our code the color of this link is defined? We could search for the entire selector, but we use SCSS in this project and the selectors are nested. `active` is too generic, it appears dozens of times in our project, so we search for `.header {` in our IDE, which yields six results. We inspect each of the six occurrences and notice that four of them contain very little code and are irrelevant to us. Two remaining. We open the first occurrence. After a lot of scrolling, we realize, that this is where the mobile styles are defined, as the entire file is wrapped in a media breakpoint. We don’t care about the mobile styles for now, as we have encountered the bug on desktop, but at a later point, we should come back to this and make sure the mobile version is correct.

So we switch to the final occurrence, of which we now know that it must be the right place. The `.header` selector here contains about 300 lines of code. We search for `.nav` in this file, another eight occurrences. We sieve through all of them, three of them are outside of the `.header` selector, five are inside of it. We look through the five relevant ones, and one of them is finally the one we are looking for. There isn’t a lot of code inside of that selector and we can easily find the `.active` selector. We update the color. Done!

We might have spent five minutes to fix this bug. With experience, you get faster at this detective work. Despite of this, you have to perform this dance again and again. Sometimes ten times a day, sometimes a hundred times. Each time this process takes time. Every time there is a risk that we might forget something, as with this example, where we forgot to check the mobile breakpoint. Or worse, you think you changed the code in the right place, but actually it’s the wrong place. At best you notice your mistak. You reverse your change and perform the dance again. Hopefully, you end up in the right place the second time around. At worst, you change something and don’t notice it also affects other elements. Your bugfix becomes another bug.

### Scattered styles

This is a problem with CSS in general, but it gets worse with utility classes, for example with Bootstrap. You can’t do everything with Bootstrap, so inevitably, you end up writing your own CSS code in addition to Bootstrap, usually a lot of it.

What that means is that, if you want to change something, you have to look in two places. Once in the CSS and once in the template.

Now you might also split your mobile styles from the desktop styles, and also the animations, they’re quite complex, so let’s also separate them from the rest of the code.

Now, every time you want to change something, you have to look in four places. Those are quite extreme examples, but it happens very often that styles for one element are defined in the context of another.

For example, take this code:

```jsx
.nav {
	color: black;
}

.header {
	background-color: white;

	&.dark {
		background-color: black;

		.nav {
			color: white;
		}
	}

}
```

What bugs me about it, is that the color of the `.nav` is set in the context of the header. If you want to change something about `.nav`, you have to be aware that it is defined in one place, but changed in another. This is a very simple example, but imagine that `.header` and `.nav` both contain hundreds of lines of code.

Every time you change something about `.nav`, you have to ask yourself: “Is this the right place, the right context?”

### Overuse of variables

Variables can be very useful in certain cases, for example with colors. Nobody wants to remember hex codes. It’s much easier to define a variable with a clear name and use that instead. If the hex code of the variable changes, it changes everywhere, fantastic.

The temptation to use variables as often as possible is huge, but it is important to remember that we essentially group things together by using them. Is the padding below a slider really always the same as below a video? How about the title? Same padding below that, too?

If the designer tells us, that the spacing below the title is too large, do they mean that particular spacing, or that spacing and also the spacing below video and slider? Changes are, they only meant below the title, so now you can no longer use the variable. We now have an exception to the rule. This happens again and again, until we have lots of exceptions.

We thought that the grouping made sense, but it turns out it didn’t. By adding exception after exception, we made the group less generally applicable, more specific, more arbitrary.

If we encounter a variable, we have to ask, every time: If I change this variable, which elements will be affected? If you want to be certain nothing breaks, you have to check every single occurrence of the variable.

Furthermore, variables are yet another layer of abstraction. I mentioned findability earlier. If you just want to change a padding, you expect to encounter a fixed value, like `2rem` or `20px`. If you encounter a variable, you usually have to go to a completely different file to see what it contains. In the worst cases, it contains a calculation utilizing other variables. Now you have to check them, too. And which one of them do you have to change now? What will be affected by this change? You just wanted to change one padding in one place, now you wonder if your simple change will break half the website.

Again, variables are amazing in certain circumstances, I’m not against variables in general. But if you use variables, always ask yourself, does this grouping make sense? How likely is it, that there will be exceptions?

### Collaboration

As more people join a project, more opinions are introduced. Opinions about how to best write CSS and how to structure it. If there are no clear, universal rules, followed by all, each contributor will simply invent and follow their own rules. Chaos ensues.

This isn’t the fault of any individual collaborator. The individual sets of rules they each follow aren’t arbitrary, but come from experience. More experienced devs will have a more refined set of rules.

The problem is that all of those rules are irrelevant, if each member of the team has their own opinions about what is right and wrong, so a strong lead, an enforcement of one set of rules, either introduced by a single person or agreed upon by the entire team, is crucial.

### Missing standardization

If you do things consistently and always the same, you don’t have to think about those things every time you encounter them. The task becomes process you’ve done dozens of times, a well worn path through the woods of uncertainty.

That, by itself, is already worth a lot. It can accelerate your work tremendously by removing doubts. But standardization is also the first step to automation. If you always do things the same, it means you can teach a computer how to do it. You can also use a standard as a building block for further tooling, to create even more value.

In the next four posts, I’d like to introduce a system that solves all of those problems.
