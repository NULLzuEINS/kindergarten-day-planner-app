<template>
    <button class="btn">
      <span><slot></slot></span>
      </button>
</template>

<script>

export default {
  name: "Button",
  properties: {
  },
}
</script>
<style lang="css" scoped="false">
.btn {
   border-radius: 4px;
   border: 0;
   color: var(--color-white);
   cursor: pointer;
   margin: .5em 1em;
   padding: .5em 1em;
   text-transform: uppercase;
   transition: all 0.4s;
  background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
 }
 .btn span {
   cursor: pointer;
   display: inline-block;
   position: relative;
   transition: 0.4s;
 }
 .btn span:after {
   content: '\00bb';
   position: absolute;
   opacity: 0;
   top: 0;
   right: -20px;
   transition: 0.5s;
 }
 .btn:hover span {
   padding-right: 25px;
 }
 .btn:hover span:after {
   opacity: 1;
   right: 0;
 }

/* active */
  .btn:active {
    background: var(--color-secondary);
    color: var(--color-primary);
  }

 .btn-large {
   padding: 1em 3em;
   font-size: larger;
 }
</style>
