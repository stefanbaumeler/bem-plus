# Part 2: BEM

In the first post of this series, I have presented to you a list of problems which I frequently encounter when writing CSS, and I promised you a system that can solve all of those problems.

BEM is not that system.

It is, however, the foundation for that system. As such, I want to quickly introduce BEM, as I understand it, in this second post. Please note that BEM is interpreted slightly differently by different people. If you google BEM, you’ll find a dozen introductions, each with a slightly different set of rules.

So even if you already know BEM, I think it’s worth it to read through this post so you understand my particular interpretation, because it will be crucial in understanding the rest of the system.

Okay, let’s get started.

## The basics

BEM stands for **B**lock **E**lement **M**odifier. Those are like three categories of classes we are going to use. BEM is a methodology, a set of rules and conventions that promise a cleaner, more structured, easier to navigate codebase.

### Blocks

A block is like a group of elements. A header is a block, so is a footer. A slider, a navigation, but also smaller, self-contained units like a floating back-to-top link. Blocks contain elements, but blocks can also contain other blocks. However, if they do contain other blocks, they contain them completely. The naming convention of those blocks is utterly unspectacular: `.header`, `.slider` , and so on. If the name of the block has words, kebab-case is used: `.main-nav`, `.top-link` . Blocks can be reused, so there might be multiple sliders on a page for example, but they should only use the same name (and thus the same styles) if they look the same, or nearly the same, otherwise they should be split into two separate blocks, maybe `.teaser-slider` and `.image-slider`.

### Elements

Elements are one level down from blocks. An item in a list, a link, an icon or simply an additional div you need for styling usually does not warrant an additional block, so elements are used. Elements always belong to a block. You should never use an element class on its own, but always in the context of the containing block. Element classes consist of the block name and the element name, separated by `__`, so for example `.main-nav__item`, `.footer__title`, `slider__image` and so on. A different navigation, like a `.sidebar-nav` might also have an `item`, but then it’s the `sidebar-nav__item` no longer the `main-nav__item`.

While an element might be located within another element, its position does not affect the name of the class. So a link belonging to a `.main-nav` block may be located inside a `.main-nav__item`, but its class will still be `.main-nav__link`, not `.main-nav__item__link`. The structure of elements is always `.[block]__[element]`.

To avoid confusion, I will refer to BEM elements as “elements”, and to HTML Elements as “tags” from here on out. I will refer to block and element classes together as “base classes”.

### Modifiers

Modifiers are used to change the appearance of a base class. It is always used in addition to the base class, never on its own. A base class can have multiple modifiers, which can be used separately or together, and only the code that describes this difference is found in the modifier class. This lets you reuse base class, even if they look slightly different. Modifiers are separated from the base class by `--`. Examples would include `.main-nav--active`, `.teaser--hidden` on blocks, or `.main-nav__item--active` or `.teaser__title--large` on elements.

While BEM pays a lot of attention to keeping the specificity as low as possible, modifiers are allowed to affect child elements. In general, this is preferable to having to toggle multiple modifiers.

## Writing the HTML

A block together with its elements could look like this:

```html
<div class="main-nav main-nav--active">
	<div class="logo">
		<img class="logo__image" src="...">
	</div>
	<button class="main-nav__burger"></button>
	<ul class="main-nav__list">
		<li class="main-nav__item">
			<a class="main-nav__link" href="#">...</a>
		</li>
		<li class="main-nav__item">
			<a class="main-nav__link" href="#">...</a>
		</li>
		<li class="main-nav__item">
			<a class="main-nav__link" href="#">...</a>
		</li>
	</ul>
</div>
```

The following rules apply to the HTML portion of BEM:

- The base class always comes before the modifier class, as it is easier to read this way. There’s also a more practical reason for this, which I’ll get to later.
- A tag may only ever have one base class, plus any number of modifiers (of that base class). This is to avoid conflicting styles and chaos.

## Writing the CSS

When writing CSS, base classes should not be nested. In fact, with the methodology outlined above, it is no longer necessary to nest them. For the above example, the SCSS code might look like this:

```scss
// main-nav.scss
.main-nav {
	// ...

	&__burger {
		// ...
	}

	&__list {
		// ...
	}

	&__item {
		// ...
	}

	&__link {
		// ...

		&:hover {
		  // underlined
	  }

		&--active {
		  // different color
	  }
	}

	&--active {
		// ...

		.logo__image {
		  // hidden
		}

		.main-nav__burger {
			// different icon
		}
	}
}

// logo.scss
.logo {
	// ...

	&__image {
		// ...
	}
}
```

Note how the `.main-nav__item` is _not_ nested inside the `.main-nav__list` here. Yes, one is nested inside the other in the HTML code, but that does not mean it has to be the same way here. Nesting them would increase the specificity from 10 to 20, something we would like to avoid. But hold on, a bit further down, we do have a specificity of 20. The `.main-nav__burger` is nested inside the `.main-nav--active` class. This is fine, because those styles only apply if the `active` modifier is applied. In this case, we want to override the default styles applied to `.main-nav__burger`. In this case, the increased specificity is not only “okay whatever”, it is a welcome side effect and ensures those styles are always applied, because the specificity is higher.

While this is not always possible, you should strive to only ever use those two levels of specificity. In some cases, styles might depend on more than one modifier, or maybe you really want to apply certain styles to an element only if it appears after another element (`+` or `~`). In such cases, it is fine to increase the specificity, but in general, you should keep the specificity as low as possible.

It is generally advisable to have one file per block. The file should have the same name as the block.

## Additional things you want to avoid when using BEM

I’m not going to mention every single thing you may want to avoid when writing CSS in general, like using `!important` or `float`, but will only focus on BEM specifically.

### Using utility classes

One of the strengths of BEM is that it reduces the amount of places you have to check if you are looking for something. If you use utility classes, you negate this benefit. If there’s a bug with the `.main-nav__item`, you no longer only have to check this class, but it might also be in the `visible` class, or in the `pt-3` class, or the culprit might be the `flex-wrap` class. The goal is to make sure the bug can only ever be in one place. BEM doesn’t quite get all the way to _one single place_, but we’ll get to that.

As an alternative, you can use mixins, though don’t overdo it! Use them only if you detect a pattern, do not extract two or three lines of simple CSS into its own mixin. As is the case with variables, mixins group things. In the context of BEM, styles across blocks are linked together. So, when introducing a mixin, you have to balance utility with the risk of a change affecting more than you intended.

### Using inline styles

We all know we shouldn’t use inline styles, but with JS and in particular with frontend frameworks like Vue or React, the temptation of toggling just a `display` property is greater than ever. Don’t do it. Use a modifier instead. The reason is the same as with utility classes: It decentralizes styles, which is something we want to avoid.

### Styling tags or IDs

IDs shouldn’t be styled in general. Styling tags directly, without a class (like `li { ... }`) is only permitted for very simple, global styles, such as in the context of a CSS reset. The reason, again, is to avoid decentralizing styles, plus to avoid specificity issues in this case.

### Solving CSS tasks with JavaScript or template code

Sometimes you need some sort of behavior you cannot create with CSS alone, like an animation, or if something should only be displayed on click. This is natural, but you should always ask yourself: Can I solve this with CSS alone? If it is possible to solve something with CSS, you should most likely do that. Here’s some things that you can do with CSS that I often see people use template code for:

- Toggling between a mobile and a desktop navigation. It’s generally a bad idea to have the mobile navigation separate and in addition to the desktop navigation in the template. Instead, use CSS to style the same template (in some cases very) differently for desktop and mobile.
- Changing the order of elements based on the viewport: Use `display: flex` and `order`
- Transitioning to `height: auto`: Use `display: grid`. Have a look at [this](https://www.stefanjudis.com/snippets/how-to-animate-height-with-css-grid/).

I’ll leave it at that. If you want a more comprehensive introduction to BEM with more examples, you should check out [https://getbem.com/](https://getbem.com/)

But before we move on, I have to ask

## Has BEM solved all of our problems?

In the last post, we discussed a list of problems commonly encountered with CSS. Now we have to ask, did we solve those problems with BEM?

Let’s have a look:

### Specificity

Yes, I think it is fair to say that we have fixed this issue. As this was the primary purpose of BEM when it was first introduced, this does not come as a surprise.

I’d give this section a 10/10.

### Findability, Scattered Styles

I think we have definitely improved the situation. When investigating an issue with the browser dev tools, it is easier than before to identify where the issue is coming from in the code. However, the code that is responsible for the issue might still be located in various different places. If the issue lies with the `.main-nav__item`, it is not guaranteed that the responsible code can be found in the `main-nav.scss` file. If, say, the item changes its appearance based on the `.header--dark` modifier, the responsible code might be found in the `header.scss` file instead. When using SCSS, it is also not possible to simply search for “main-nav__item” in our editor, because the name of the class will be split into `.main-nav` and `&__item`. If we are certain the code must be in the `main-nav.scss` file, we can search for `&__item`, but we again run into the issue that `&__item` might also appear inside of modifiers.

For all of those reasons, I think this area is still in need of improvement.

Both those sections get a 5/10 each from me.

### Collaboration, Missing Standardization

Introducing a common set of rules that everybody involved in a project has to adhere to certainly is an improvement. I still think that there is too much… uh, let’s call it freedom for individual expression of creativity.

Or in other words: The rules are not strict enough. Even if you follow the teachings of BEM precisely, there are still many ways to do things, structure things, break things.

With BEM, we have introduced a naming convention, but the CSS code, while it looks very different and a lot more organized now, is not yet standardized to the point where the structure is so rigid we can start to build things on top of it.

Here too, I think there’s room for improvement.

Collaboration gets a 5/10 from me. The code is not yet standardized to a point that would be useful yet, so it gets 0/10.

## The next step

The final score for BEM is 25/50. We solved half of our problems, so to speak. This is where I was in early 2020. I had been using BEM for a while and was definitely a devout believer of the system, but I also felt like there were still some issues left. Room to improve. To stick to the religious theme, I felt like I had found half a bible. I had a look around on the internet. How did other people using BEM solve those remaining issues? I was disappointed to find that, while BEM is widely used, nobody had thought to improve on it.

The sane option would have been to abandon BEM and go look for a different system that solved all the problems mentioned in the previous post to their full extent. But I was a huge fan of BEM, and still am, so I didn’t have another choice. I had to figure out the other half of the bible myself. I started to experiment and I came up with a system on top of BEM. It is to BEM what Next.js is to React, so you could call it a meta methodology.

I call it BEM+. I’m not known for my creativity in naming things.

In the next post, I will introduce BEM+ to you. This is where the really interesting part starts.
