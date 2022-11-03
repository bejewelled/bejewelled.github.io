
<div on:click class='mainText p-1 items-center text-center game-btn'>{text}</div>



<script>
	export let text;
</script>

<style>
  .game-btn {
    border: 1px solid white;
    color: #d9d9d9;
    cursor: pointer;
    user-select: none;
  }
  .game-btn:hover {
    color: white;
  }
</style>