
<div on:click class='mainText items-center text-center w-[55px] h-[24px] align-middle text-center options-btn'>
  <span class='align-baseline'>{text}</span>
</div>



<script>
	export let text;
</script>

<style>
  .options-btn {
    border: 1px solid #595959;
    color: #595959;
    cursor: pointer;
    user-select: none;
  }
  .options-btn:hover {
    color: #999999;
    border: 1px solid #999999;
  }
</style>