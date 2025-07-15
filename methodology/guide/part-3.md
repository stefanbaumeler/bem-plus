# Part 3: bem-plus

Even in the first post in this series, I have noted that styling problems are very different from selector problems. I think the separation is greater than most people realize. In fact, the styles and the selectors can be understood as two completely separate systems, and separating those two systems is a core part of bem-plus.

So the first step is to take the styles of each element of a block, and put them into a mixin. The name of that mixin should always be `[block name]-[element name]`, or in the case of the block itself `[block name]-root`. We’ll also wrap the now bare selectors in another mixin, which we will include at the base level at the very bottom of the file. You might think that would cause chaos and confusion, but the opposite is the case. We just vastly simplified our structure, and each element now has a unique, easy to search for name.

But let’s take a look at an example. We’ll continue with the example from the previous post. From this:

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

We create this:

`main-nav.scss`:

```scss
@mixin main-nav-root {
	// ...

	&--active {
		// ...

		.logo__image {
			// hidden (just as an example)
		}

		.main-nav__burger {
			// ...
		}
	}
}

@mixin main-nav-burger {
	// ...
}

@mixin main-nav-list {
	// ...
}

@mixin main-nav-item {
	// ...
}

@mixin main-nav-link {
	// ...

	&:hover {
		// ...
	}

	&--active {
		// ...
	}
}

@mixin main-nav {
	.main-nav {
		@include main-nav-root;

		&__burger {
			@include main-nav-burger;
		}

		&__list {
			@include main-nav-list;
		}

		&__item {
			@include main-nav-item;
		}

		&__link {
			@include main-nav-link;
		}
	}
}

@include main-nav;
```

`logo.scss`:

```scss
@mixin logo-root {
	// ...
}

@mixin logo-image {
	// ...
}

@mixin logo {
	.logo {
		@include logo-root;

		&__image {
			@include logo-image;
		}
	}
}

@include logo;
```

Note that we have moved the modifiers together with the styles. We only extracted the content of the elements into mixins, not the modifiers and also not `&:hover`, or media queries or pseudo-elements for that matter.

The mixins we just created are called element mixins. While they are regular mixins, some rules apply to them that do not apply to other mixins, which I will call functional mixins:

- Do not reuse. Every element mixin should only be used once, in the index below. If you have code inside an element mixin you would like to reuse, abstract that code into a functional mixin and `@include` that mixin in the element mixin.

This, I think, already helps a lot. If we are looking for a specific element, we can search the entire project for that element (replacing `__` with `-`), and we will always find that element and only that element. Additionally, at the bottom of every scss file (which should only ever contain one block), we have essentially created an index of what that file contains, which further improves orientation.

We wrap that index in its own mixin for three reasons:

- Like with single elements, we can now disable the styles of the entire block by commenting out a single line of code (the last one). We have a single “hook” to control the entire block.
- As all the other code now lives in mixins, it would be odd to not also put this in a mixin.
- It is easier for a script to detect. We’ll talk about why this is important later.

Keep the index flat and clean! Its only job is to reference the element mixins. Styles, media queries, modifiers and functional mixins are not allowed here.

But let’s take a closer look at the `main-nav-root` mixin. The `&--active` modifier is fine. It _belongs_ there. But the other two selectors, `.logo__image` and `.main-nav__burger` do not really belong there. The styles for the burger element would really belong to the `main-nav-burger` mixin and the styles for the logo image do not even really belong into this file.

So let’s tackle that next. Luckily, there’s a tool provided by SCSS made exactly for this case:

## @at-root

If you want to understand `@at-root` you first have to understand `&`. You have likely used `&` many times, but it’s worth taking a closer look. `&` means “Take the selector as we built it up until now, and append more to it.” `&` is a shorthand. It stands in for the selector, for the “context” we have built up, up to this point.

`@at-root` works the other way around. Instead of appending, we prepend. Here’s an example:

```scss
.foo {
	&__bar { // note that the & essentially stands for ".foo" here
		// once compiled, this results in ".foo__bar {}"
	}
}

.foo {
	.bar { // With nesting, the & is implicit. On this line, you could also write &.bar {
		// once compiled, this results in ".foo .bar {}"
	}
}

.foo {
	@at-root .bar & {
		// once compiled, this results in ".bar .foo {}"
	}
}
```

Another way to think about this is like a cursor. By using `@at-root` we essentially move the cursor outside of all the selectors we are currently located in. We move it to the root, so to speak, hence the name.

But note the `&` we use together with the `@at-root`, this is the best part. The `&` doesn’t care about `@at-root`, it behaves as if it was written inside the `.foo` context, so it returns `.foo`, hence the final selector `.bar .foo`.

Note however that we _have to_ write `&` at the end, otherwise we end up with just `.bar`.

Here’s another example:

```scss
.card {
	background-color: white;

	@at-root .body--dark & {
		background-color: black;
	}
}
```

This is amazing, because it means we no longer have to define that the card shall have a black background inside the `.body--dark` selector. We can flip it around. This, in turn, means we can finally define all styles where they belong. This leads to a system where, if you are looking at an element mixin, you can be certain that all CSS code that affects this element in any way is defined here. You do not have to look anywhere else. This is everything. If there’s a bug with this element, this is where you have to look, and nowhere else.

Let’s return to our initial example. We can now do this:

```scss
@mixin main-nav-root {
	// ...

	&--active {
		// ...

		// *poof*

		// *poof*
	}
}

@mixin main-nav-burger {
	// ...

	@at-root .main-nav--active & {
		// ...
	}
}

@mixin main-nav-list {
	// ...
}

@mixin main-nav-item {
	// ...
}

@mixin main-nav-link {
	// ...

	&:hover {
		// ...
	}

	&--active {
		// ...
	}
}

@mixin main-nav {
	.main-nav {
		@include main-nav-root;

		&__burger {
			@include main-nav-burger;
		}

		&__list {
			@include main-nav-list;
		}

		&__item {
			@include main-nav-item;
		}

		&__link {
			@include main-nav-link;
		}
	}
}

@include main-nav;
```

`logo.scss`:

```scss
@mixin logo-root {
	// ...
}

@mixin logo-image {
	// ...

	@at-root .main-nav--active & {
		// ...
	}
}

@mixin logo {
	.logo {
		@include logo-root;

		&__image {
			@include logo-image;
		}
	}
}

@include logo;
```

## Order of elements in the index

- The order of the elements in the index should be the order in which they appear in the HTML structure.
- The order of the element mixins should be the same as in the index.

Those two rules give no functional benefit, but help with orientation. I do not always strictly follow those two rules myself, but I try to follow them when I first write the block and its template.

## Order of stuff inside an element mixin

The order of different types of stuff in an element mixin is defined, because a different order might cause things to break. Generally speaking, things that affect the element itself come first. The further removed from the element a sub-selector is, the lower down it should appear. The order is like this:

1. Including mixins
2. The styles
3. `@media` queries or breakpoint mixins
4. `&:hover`, `&:focus` and such
5. Pseudo-elements (`&:before` and `&:after`)
6. modifiers
7. Root dependencies (`@at-root`)

```scss
@mixin header-root {
	@include some-mixin;

	// styles go here

	@media screen and (min-width: 1000px) {
		// ...
	}

	&:hover {
		// ...
	}

	&:before {
		// ...
	}

	&--active {
		// ...
	}

	@at-root .body--fixed & {
		// ...
	}
}
```

I do not usually enforce this strictly, and sometimes I do it differently too. I think the most important one is #1. Including mixins go first because that mixin serves essentially as a template of the element we are writing here. The styles that come right after should be able to override whatever styles are set inside the mixin.

I think we can all agree that styles should be as close to the top as possible, so they go second.

I’d also put media queries third because they still directly affect the element itself, but now only if the viewport has a certain size. Such an element mixin can grow quite large, and if the media queries are not near the top, you might not realize it exists at all.

Modifiers on the other hand can be further down because If you want to edit the element itself, you don’t care about the modifier, and if you want to edit the modifier, you are specifically looking for it, so you don’t “miss” it.

As for #4 and #5, I think they just have to go somewhere, and because there’s good reason to put the other things where they are, they just kind of end up in the middle.

This order also applies within modifiers, pseudo-elements and any other time you are in a context where the styles themselves are written.

## More things to consider

- The index should be the only place where you define selectors at the root level. Element mixins and mixins in general should only return styles and sub-selectors.
- Do not use `@extend` / templates. Mixins do a better job in this situation and there’s no reason for them.

## Speeding up writing bem-plus code with live templates

“There’s a lot more code I have to write now”, you might say, and you’d be correct with that assessment. This system is a bit more verbose than what we started with. But first of all, look at all the problems we solved with this system. Isn’t not having to deal with any of those problems ever again worth a couple extra lines of code?

Secondly, look at what we’ve done so far. We have taken a bunch of code that does not follow any sort of pattern, and we have introduced a standardized, repetitive pattern that is always the same. The existence of such a pattern allows us to now automate certain parts of it.

Most modern IDEs allow you to define live templates. We’ll define two of those, which will allow you to write the structure of a bem-plus file much faster.

### Installation

**IntelliJ IDEs**

1. Navigate to Settings > Editor > Live Templates. In some of their IDEs (like Rider) you might have to open “Other Languages”.
2. Click on the little Plus at the top of the list and select “Template Group…”. If you have created live templates before, you can also put the live templates we are about to create somewhere else, this is purely for organizational purposes. Name the group however you like. I tend to put all my live templates in the same place, no matter the language, so I simply call this group “custom”.
3. Click the little plus again, then click “Live Template”
4. As the abbreviation, enter `@tree`, or whatever you prefer.
5. As the template text, enter the following:

```scss
@mixin $BLOCK$-root {
    $END$
}

@mixin $BLOCK$ {
    .$BLOCK$ {
        @include $BLOCK$-root;
    }
}

@include $BLOCK$;
```

1. Click the Change button at the very bottom and select CSS.
2. Click the “Edit Variables…” button. An entry with the name `BLOCK` should already exist. as the Expression, enter this: `regularExpression(fileNameWithoutExtension(), "_", "")`
3. Repeat steps 3-7 with the following information:

- Abbreviation: `&__`
- Template text:

```scss
&__$ELEMENT$ {
    @include $BLOCKNAME$-$ELEMENT$;
}

```

- Variables
    - `ELEMENT`: (leave empty)
    - `BLOCKNAME`: `regularExpression(fileNameWithoutExtension(), "_", "")`

4. Save the settings.

**VSCode**

1. Select Code > Settings… > Configure User Snippets
2. Search for and open the “scss” snippet file
3. Add the following two snippets:

```json
"bem-plus tree": {
		"prefix": "@tree",
		"body": "@mixin ${TM_FILENAME_BASE}-root {\\n\\t$0\\n}\\n\\n@mixin ${TM_FILENAME_BASE} {\\n\\t.${TM_FILENAME_BASE} {\\n\\t\\t@include ${TM_FILENAME_BASE}-root;\\n\\t}\\n}\\n\\n@include ${TM_FILENAME_BASE};"
	},
	"bem-plus element": {
		"prefix": "&__",
		"body": "&__${1} {\\n\\t@include ${TM_FILENAME_BASE}-${1};\\n}"
	}
```

### Usage

For those two live templates to work, the name of the file must be the same as the name of the block.

Now, if you create a new scss file for a new block, you can simply type in `@tree` and press tab. The basic structure with an index and the root element mixin will be created.

The second live template is meant to be used within the index: Type `&__` and press tab, now write the name of the element you wish to create. Unfortunately this does not also create the element mixin itself, you still have to do that yourself, but this already speeds up the creation of new elements a lot I think.

## Conclusion

That’s it. It’s not that complicated, right? Once you get used to the system, it starts to feel like water, like the air you breathe. It becomes so normal you start to notice its absence much more than its presence.

Let’s have a final look at the list of problems with CSS we defined at the very beginning, to see if we could improve our score. With BEM alone, we got to a score of 25/50.

### Specificity

We’ve already solved this with BEM. I don’t think this needs further improvement. 10/10

### Findability, Scattered Styles

If you are looking for a certain element, you can always search for it. By doing so, you will always only find one result, the one you expect. In that place you have found, you can be certain to find what you are looking for. There is no other place where it could be. Everything about the element you investigate is defined here.

I don’t think that this can be improved further, thus, both of those sections get a 10/10.

### Collaboration

With BEM and now bem-plus we have introduced a standardized way of doing things. While with BEM there is still a lot of freedom on how to structure your code, with bem-plus there is usually only one correct way to do things.

bem-plus is also very visible. It is clearly very different from standard CSS code. If you open a bem-plus file, you can see at first glance that there’s a system here. If someone disregards this system and writes regular CSS code somewhere, this sticks out and is thus easy to detect.

There is no way yet to programmatically enforce the bem-plus syntax, so this is not perfect yet.

I think BEM has improved the situation for the most part, but I also think it got improved again by bem-plus, so I’d give bem-plus as it is today an 8/10.

### Missing Standardization

Unlike BEM, with bem-plus we now have a highly standardized structure. It is so standardized in fact, that we can now use those scss files to derive useful information: What blocks exist in this application? What elements do belong to this block?

This information is super easy to obtain: Just have a look at the index! That information is not only useful for us as developers, it is also useful to generate stuff. And that’s exactly what the final part of our long journy will be about.

The fact that we can now even consider such a thing means that our code is now highly standardized. As such, bem-plus gets a score of 10/10 from me for standardization.

This leads to a final score of 48/50. I might be biased.

I’m still thinking about those final two points, though. I think there’s a way, but I have not fleshed it out yet. For now, let’s have a look at how we can profit from bem-plus beyond CSS.
