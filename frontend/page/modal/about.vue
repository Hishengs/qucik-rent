<template>
	<Modal class="about-modal" v-model="show" title="关于网站">
		<div style="font-size: 14px; line-height: 1.5;">
			<p>　　创建这个网站的初衷很简单，就是在豆瓣找房子时被各种中介和混乱的信息搞得很烦，于是，作为一名程序员，我觉得有必要利用自己的专业技能为大家造点福利。</p>
			<p>　　愿我们租房子的路上少点中介。</p>
		</div>
	</Modal>
</template>

<script>
	export default {
		name: 'about-modal',
		props: {
			value: {
				type: Boolean,
				default: false,
			}
		},
		data (){
			return {
				show: false,
			};
		},
		watch: {
			show (val){
				if(!val){
					this.$emit('input', val);
				}
			},
			value (val){
				this.show = val;
			}
		},
	};
</script>

<style lang="less" scoped>
	.about-modal {
		//
	}
</style>