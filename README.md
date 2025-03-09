# **Dii-Helper**

This little object contains some functionality what help us to develop D3 Visualizations easier.

 * First of all, the nestForD3 with the nestKeys function is a little modification of d3.nest().
I changed some attribute, but the most of the code is from the original D3.
With this, we can create flare with key,value pairs without writing complicated functions or installing Underscore
or other library.

 * DiiHelper also contains some function what help to find numbers in the flare what we generated. This is good if we
 use Integers to give colors to the graphs
 

# Usage 

This is a simple example how can we use the DiiHelper
```typescript
const DiiHelper = require('dii-helper');

const data = []; //Your data array with objects
const nestKeys = ['category','country','id']; // The key/property name, what we use for filtering in the nest.

const flare = {
     name: 'Root',
     children: DiiHelper.nestKeys(data, nestKeys),
 };

```
 In this example 
 * the first layer will be the categories, 
 * second layer/depth is the countries 
 * and the last one is the ID-s. 
 
 It is easy to represent if we make a Tree Map (i will do in github)

---

 Original D3 Library is on the web page: https://d3js.org
