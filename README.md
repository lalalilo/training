# Lalilo training

## [core] git

## [front] styling

### css

#### kata 1

Do the flex tower defense: http://www.flexboxdefense.com/

<details>
<summary>Takeway</summary>
<p>This doc is probably the most complete one. Make sure you understand it. https://css-tricks.com/snippets/css/a-guide-to-flexbox/</p>
</details>

### styled-components

#### kata 1

Try to fix the style not applied in [this snipet](https://codesandbox.io/s/730z2w9y7x)

<details><summary>Takeway</summary>
<p>

If you want a component to be stylable with `styled(MyComponent)`, your component must forward at least the `className` prop like this:

```javascript
const StylableTitle = ({ className }) => <h1 className={className}>Title</h1>;

// you might also see this:
const StylableTitle = props => <h1 {...props}>Title</h1>;
```

</p>
</details>

## Typescript
