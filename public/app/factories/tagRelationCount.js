angular.module('app').factory('tagRelationCount',['$rootScope','cache',function($rootScope,cache){
	var add=function(arg){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'TagRelationCount::insert',
				arg:arg,
			}
			$.post("ajax.php",post_data,function(res){
				
				var list=cache.levelList.find(function(val){
					return val.data.id==arg.level_id;
				}).list;
				
				if(list){
					list.push(res);
					$rootScope.$apply();
				}
				resolve();
			},"json")
		})
	}
	var del=function(arg){
		return new Promise(function(resolve,reject){
			
			var post_data={
				func_name:'TagRelationCount::delete',
				arg:arg,
			}
			
			$.post("ajax.php",post_data,function(res){
				
				if(res.status){
					var list=cache.levelList.find(function(val){
						return val.data.id==arg.level_id;
					}).list;
					
					var index=list.findIndex(function(val){
						return arg.id==val.id;
					})
					
					if(index!=-1){
						list.splice(index,1);
						$rootScope.$apply();
					}
				}
				resolve(res);
			},"json")
		})
	}
	var get=function(where_list){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'TagRelationCount::getList',
				arg:{
					where_list:where_list,
				},
			}
			$.post("ajax.php",post_data,function(res){
				resolve(res);
				$rootScope.$apply();
			},"json")
		});
	}
	var ch=function(arg){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'TagRelationCount::update',
				arg:arg,
			}
			$.post("ajax.php",post_data,function(res){
				resolve(res);
				$rootScope.$apply();
			},"json")
		});
	}
	return {
		add:add,
		del:del,
		get:get,
		ch:ch,
	}
}])