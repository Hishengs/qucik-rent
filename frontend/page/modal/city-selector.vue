<template>
	<Modal class="city-selector" title="切换城市" v-model="show">
		<div v-if="currentCity">
			<Tag type="border" :color="city.key === currentCity.key ? 'blue' : undefined" v-for="city, i in cities" :key="i" @click.native="selectedCityIndex=i;">{{ city.name }}</Tag>
			<!-- 选择城市的小组 -->
			<div class="divider"></div>
			<Tag type="border" :color="group.key === selectedGroupIndex.key ? 'blue' : undefined" v-for="group, i in currentCity.groups" :key="i" @click.native="selectedGroupIndex=i;">{{ group.name }}</Tag>
		</div>
	</Modal>
</template>

<script>
	export default {
		name: 'city-selector',
		props: {
			value: {
				type: Boolean,
				default: false,
			}
		},
		data (){
			return {
				show: false,
				cities: [],
				selectedCityIndex: 0,
				selectedGroupIndex: 0,
			};
		},
		computed: {
			currentCity (){
				return this.cities[this.selectedCityIndex];
			},
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
			this.getCities();
		},
		methods: {
			// 获取城市列表
			getCities (){
				this.api.group.getCities().then(res => {
					console.log(res);
					if(res.data.err.level < 3){
						this.cities = res.data.data || [];
					}
				})
			},
		},
	};
</script>

<style lang="less" scoped>
	.city-selector {
		.divider {
			height: 0;
			border-top: 1px solid #efefef;
			margin: 10px;
			width: 90%;
		}
	}
</style>