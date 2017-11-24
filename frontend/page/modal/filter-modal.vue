<template>
	<Modal class="filter-modal" v-model="show" title="过滤器设置" @on-cancel="cancel" @on-ok="confirm">
		<Form>
			<FormItem label="屏蔽掉仅限女生">
				<Select v-model="filterSetting.femaleOnly">
					<Option :value="0" label="不屏蔽"></Option>
					<Option :value="1" label="屏蔽"></Option>
				</Select>
				<Tag>注：作为一名男生，我也深感无奈啊</Tag>
			</FormItem>
			<FormItem label="最大评论数">
				<Input type="text" v-model="filterSetting.maxComments" placeholder="最大评论数"></Input>
			</FormItem>
			<FormItem label="最大喜欢数">
				<Input type="text" v-model="filterSetting.maxLikes" placeholder="最大喜欢数"></Input>
			</FormItem>
			<FormItem label="关键词黑名单">
				<Input type="text" v-model="filterSetting.keywords" placeholder="关键词以#分隔"></Input>
				例如：<Tag>自如</Tag><Tag>拎包入住</Tag>
			</FormItem>
			<FormItem label="用户黑名单">
				<Input type="text" v-model="filterSetting.userBlackList" placeholder="用户名以#分隔"></Input>
				例如：<Tag>老王</Tag><Tag>行者孙</Tag>
			</FormItem>
		</Form>
		<Tag>注：登录后可保存你的过滤器设置。</Tag>
		<!-- <div slot="footer">
			<Button type="text" @click="show=false;">取消</Button>
			<Button type="primary" @click="saveFilter">保存</Button>
		</div> -->
	</Modal>
</template>

<script>
	export default {
		name: 'filter-modal',
		props: {
			value: {
				type: Boolean,
				default: false,
			}
		},
		data (){
			return {
				show: false,
				filterSetting: {
					femaleOnly: 0,
					maxComments: 50,
					maxLikes: 100,
					keywords: '',
					userBlackList: ''
				},
				filterSettingCopy: {},
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
		created (){
			this.filterSettingCopy = Object.assign({}, this.filterSetting);
		},
		methods: {
			// 保存过滤器设置
			saveFilter (){
				// this.getTopics();
				this.show = false;
			},
			cancel (){
				this.filterSetting = Object.assign({}, this.filterSettingCopy);
			},
			confirm (){
				this.filterSettingCopy = Object.assign({}, this.filterSetting);
				this.$emit('on-confirm', Object.assign({}, this.filterSetting));
			},
		}
	};
</script>

<style lang="less" scoped>
	.filter-modal {
		//
	}
</style>