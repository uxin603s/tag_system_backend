angular.module('app').controller('LevelCtrl',['$scope',function($scope){
	
	$scope.searchTagNameTmp={};
	$scope.tagName={};
	$scope.$watch("searchTagNameTmp",function(value){
		if(Object.keys(value).length){
			clearTimeout($scope.search_tag_name_tmp_timer);
			var tid_arr=angular.copy(value);
			$scope.search_tag_name_tmp_timer=setTimeout(function(tid_arr){
				var post_data={
					func_name:'Tag::getTagIdTOName',
					arg:{
						tid_arr:tid_arr,
					}
				}
				$.post("ajax.php",post_data,function(res){
					if(res.status){
						for(var i in res.list){
							var data=res.list[i];
							var id=data.id;
							var name=data.name;
							$scope.tagName[id]=name;
						}
					}
					$scope.searchTagNameTmp={};
					$scope.$apply();
				},"json")
			}.bind(this,tid_arr),500)
		}
	},1)
	
	$scope.getList=function(){		
		clearTimeout($scope.getList_timer);
		$scope.getList_timer=setTimeout(function(){
			var post_data={
				func_name:'TagLevel::getList',
				arg:{
					api_id:$scope.user_config.select_api_level,
				}
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					$scope.list=res.list;
				}
				$scope.$apply();
			},"json")
		},500)
	}
	
	$scope.getList();
	$scope.insert=function(){
		var post_data={
			func_name:'TagLevel::insert',
			arg:{
				api_id:$scope.user_config.select_api_level,
			}
		}
		$.post("ajax.php",post_data,function(res){
			if(res.status){
				$scope.list.push(res.insert)
			}
			$scope.$apply();
		},"json")
	}
	$scope.delete=function(index){
		var post_data={
			func_name:'TagLevel::delete',
			arg:{
				level_id:$scope.list[index].id,
				api_id:$scope.user_config.select_api_level,
			}
		}
		$.post("ajax.php",post_data,function(res){
			if(res.status){
				$scope.list.splice(index,1)
			}
			$scope.$apply();
		},"json")
	}
	
	$scope.update=function(func_name,update,where){
		
		var post_data={
			func_name:func_name,
			arg:{
				update:update,
				where:where,
			}
		}
		// console.log('update',post_data)
		$.post("ajax.php",post_data,function(res){
			// console.log(res)
			if(res.status){
				var data=$scope.list.find(function(value){
					var flag=1;
					for(var i in where){
						flag*=where[i]==value[i]?1:0;
					}
					return flag;
				});
				if(data){
					for(var i in update){
						data[i]=update[i];
					}
				}
				$scope.$apply();
			}
		},"json")
	}
	
	
	$scope.$watch("list.length",function(list_length){
		if(!list_length)return;
		for(var index in $scope.list){
			if($scope.list[index].sort_id==index)continue;
			var update={sort_id:index}
			var where={
				api_id:$scope.user_config.select_api_level,
				level_id:$scope.list[index].id,
			}
			$scope.update('TagApiLevel::update',update,where);
		}
	},1);
	
	
	// $scope.$watch("list",function(list){
		// for(var i in list){
			// console.log(list[i])
		// }
	// },1)
}])
