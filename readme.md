# Fluid Waveform Build Package 

The bits needed to build the Max-JS compatible version of fav.js, assemble the ingredients for including in a Max package. 

## TODO 
* Document what Babel is doing: tl;dr converting ES6 to Max's older and somewhat idiosyncratic JS. The horrible bit is that the `requires` stuff ends up needing extra massaging with a custom plugin 

## Building

You can use whichever package manager you prefer `npm`, `pnpm`, `yarn`. In this case let's pretend we are using `npm`.

1. `npm i`
2. `npm run build`
3. `npm run bundle`

Everything you need to use the object in Max should be in the `max_package` subtree. 
