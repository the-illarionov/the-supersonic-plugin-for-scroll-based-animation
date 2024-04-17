# The Supersonic Plugin For Scroll Based Animation

![gzip size](https://img.shields.io/bundlejs/size/the-supersonic-plugin-for-scroll-based-animation)
![test-and-build](https://github.com/the-illarionov/the-supersonic-plugin-for-scroll-based-animation/actions/workflows/test-and-build.yml/badge.svg)

- [Main features](#main-features)
- [Installation](#installation)
- [Examples](#examples)
- [Configuration](#configuration)
- [Possible issues](#possible-issues)

---

Once upon a time, I suddenly realized that I need to animate 1000 pictures of my cat Bartholomew with scrolling. Moreover, it had to work on mobiles as is, without any additional rules. And work fast without killing the browser. And be highly customizable to fit any needs.

Other solutions did not go well, so I decided to write my own (of course, I did).

[Go check the final result and see how 1000 Bartholomews are animated!](https://the-illarionov.com/the-supersonic-plugin-for-scroll-based-animation/bartholomeow)

# Main features

1. ## 2.5kb gzipped
    - 0 dependencies
    - 100% TypeScript
    - ESM and IIFE formats

2. ## Use native CSS animations
    ```javascript
    const plugin = new TheSupersonicPlugin({
        drivers: {
            hooray: {
                start: document.querySelector('.start') // When this element will appear on the screen animation will start,
                end: document.querySelector('.end') // When this element will appear on the screen animation will end,
                elements: ['.animatable'] // List of elements with CSS animations
            },
        },
    });
    ```
    ```css
    .animatable {
        animation-name: hooray;
        animation-duration: 10s; /* It has to be 10s, more details in examples */
        animation-play-state: paused; /* It will be controlled by script */
    }
    ```
    No more struggling with calculating animations, dealing with orchestrating them etc.

    Write your CSS animations as usual and let the plugin to control them. You can even have CSS animations that are being played as usual together with plugin controlled! [Check examples](https://the-illarionov.com/the-supersonic-plugin-for-scroll-based-animation/examples).

    As a bonus, you can have different animations for different screens with 0 lines of javascript code!

    Sure, we have `scrollt-imeline` upcoming, but it has some disavantages:
    - Still experimental at the time of April 2024.
    - You can't bind start of an animation to one element and end of it to completely another.

3. ## Use DOM elements as drivers of your animation

    Instead of manually setting the start and end values, you use HTML elements (**_drivers_**). Their appearance and position on the screen will control the animation. The Plugin uses the driver's top offset as a value, [check examples](https://the-illarionov.com/the-supersonic-plugin-for-scroll-based-animation/examples).

    And again, as a bonus of using DOM elements as drivers you don't have to think about responsivity, it comes out of the box (you can use `media queries` to reposition your drivers).

4. ## Customization and crazy flexibility
    Every internal stuff has a hook. Actually, everything that plugin does it does through it's API so you create as complex stuff as you want.

    Look at the [type declarations](https://the-illarionov.com/the-supersonic-plugin-for-scroll-based-animation/types) to discover all of the customization possibilities.

    You can even use plugin to animate whatever you like, not only CSS animations. Check [last example here](https://the-illarionov.com/the-supersonic-plugin-for-scroll-based-animation/examples), you will be surprised ;)

5. ## Speed

    The Plugin uses IntersectionObserver, so only visible elements will be processed. It means you can have lots of elements!

    Also, there are small tricks for tiny optimizations.

    For example, float number rounding after the decimal point is used heavily, and instead of ```parseFloat(float.toFixed(2))``` The Plugin uses bitwise rounding:
    ```javascript
    function supersonicToFixed(number: number, precision: number) {
        precision = 10 ** precision
        return ~~(number * precision) / precision
    }
    ```
    It is 90% more performant.

    As a result, [1000 Bartholomews](https://the-illarionov.com/the-supersonic-plugin-for-scroll-based-animation/bartholomeow) perform like this on 10 years old PC (i7-4770, 8Gb RAM):

    ![image](./images/performance.png)

    Yeah, it lags a little, but check the Heap size and total Scripting time!

    The Plugin itself still works extremely fast, it takes about ***0.5ms*** per frame to make all of the calculations, the rest is rendering.

    It is one goddamn thousand HTML elements animating over here!

6. ## SPA-ready

    Plugin has `uninit()` method, which clears all of the stuff. Don't forget to call it when you unmount your component.

    ```javascript
    onMounted() {
        const plugin = new TheSupersonicPlugin({
            // config...
        })
    }

    onBeforeUnmount() {
        plugin.uninit()
    }
    ```

And all of this at a price of 2.5Kb!

So what are you waiting for?

# Installation

## NPM

```
npm install the-supersonic-plugin-for-scroll-based-animation --save-dev
```

```javascript
import { TheSupersonicPlugin } from "the-supersonic-plugin-for-scroll-based-animation"

new TheSupersonicPlugin({
    // ...configuration
})
```

## CDN
### IIFE
```html
<script src="https://unpkg.com/the-supersonic-plugin-for-scroll-based-animation"></script>

<script>
  new TheSupersonicPluginWrapper.TheSupersonicPlugin({
    // ...configuration
  })
</script>
```
### ESM
```javascript
import { TheSupersonicPlugin } from "https://esm.sh/the-supersonic-plugin-for-scroll-based-animation"

new TheSupersonicPlugin({
    // ...configuration
})
```

# Examples

You can [find them here](https://the-illarionov.com/the-supersonic-plugin-for-scroll-based-animation/examples).

# Configuration
Check [types declarations](https://the-illarionov.com/the-supersonic-plugin-for-scroll-based-animation/types) to see all of the configuration options.

The Plugin consists of 3 classes:
1. `TheSupersonicPlugin`, which is act like main entry point.
2. `Driver`, which calculates it's progress from 0 to 1 according to current scroll and position of `start` and `end` elements.
3. `Animation`, which is responsible for storing and setting CSS Animation `currentTime` property.

All of them are provided too, so you can manually create your own instances:
```javascript
import {
    TheSupersonicPlugin,
    Driver,
    Animation
} from "https://esm.sh/the-supersonic-plugin-for-scroll-based-animation"

const plugin = new TheSupersonicPlugin({
    // ...configuration
})

const animation = new Animation({
    driver: plugin.driverInstances.get('some-driver'),
    // ...another configuration
})
```

## Possible issues
1. When you have **lots** of animations (more hundred), plugin can start to lag a little on start.

    It's because `domElement.getAnimations()` doesn't scale too well.

    If you really need to have lots of animations, implement lazy initialization of animation at `onActivation` driver hook. Or you can manually updating properties like [i did with 1000 Bartholomeows](https://the-illarionov.com/the-supersonic-plugin-for-scroll-based-animation/bartholomeow).

2. If you have **lots** of drivers (more thousand), plugin can start to lag a little on start.

    It's because plugin fires `updateLimits()` on start to set proper top distances to all elements, which causes `reflow`.

    If it's really a problem, consider cancelling default rendering via `onBeforeRender: () => false` and batching all of `updateLimits` call at one call.

---

Cheers from Bartholomew :3
