angular.module("app").directive("tagRelation",['$parse','$timeout',function($parse,$timeout) {
    return {
		templateUrl: 'app/directives/tagRelation/tagRelation.html?t='+Date.now(),
		restrict: 'E',
		replace:true,
		scope:{
			tagName:'=',
			searchTagNameTmp:'=',
			data:'=',
			levelList:'=',
			index:'=',
		},
        link: function($scope,$element,$attr) {
			$scope.getList=function(search,delay_time){
				var time_name='getTagRelationList_timer';
				clearTimeout($scope[time_name]);
				$scope[time_name]=setTimeout(function(){
					var post_data={
						func_name:'TagRelation::getList',
						arg:search,
					}
					$.post("ajax.php",post_data,function(res){
						$scope.list=[];
						// if($scope.levelList[$scope.index+1])
						// $scope.levelList[$scope.index+1].filter=[];
						if(res.status){
							$scope.list=res.list;
							
							for(var i in res.list){
								var id=res.list[i].child_id;
								// if($scope.levelList[$scope.index+1])
								// $scope.levelList[$scope.index+1].filter.push(id)
								$scope.searchTagNameTmp[id]=id;
							}
						}
						$scope.$apply();
					},"json")
				},delay_time);
			}
			$scope.watch_getList=function(data){
				var search={};
				if($scope.data){
					if($scope.data.id){
						search.level_id=$scope.data.id;
					}
					if($scope.data.select_tid){
						search.id=$scope.data.select_tid;
					}
				}
				if($scope.tag_name){
					search.name=$scope.tag_name;
				}
				if(search.id){
					$scope.getList(search);
					
				}
			}
			$scope.update_view=function(data){
				data.ggwp=1;
				$scope.$apply();
				delete data.ggwp;
				$scope.$apply();
			}
			
			$scope.$watch("tag_name",$scope.watch_getList,1)
			$scope.$watch("data",$scope.watch_getList,1)
			
			$scope.insert=function(){//count更新
				var search={
					name:$scope.tag_name,
					id:$scope.data.select_tid,
					level_id:$scope.data.id,
				}
				var post_data={
					func_name:'TagRelation::insert',
					arg:search,
				}
				$.post("ajax.php",post_data,function(res){
					$scope.watch_getList();
					$scope.add_flag=true;
					$scope.$apply();
					if($scope.data.sync_relation*1){
						$scope.sync_relation($scope.levelList,$scope.index,0);
					}
					$scope.update_view($scope.data);
				},"json")
			}
			$scope.delete=function(child_id){
				var search={
					id:$scope.data.select_tid,
					child_id:child_id,
					level_id:$scope.data.id,
				}
				var post_data={
					func_name:'TagRelation::delete',
					arg:search,
				}
				$.post("ajax.php",post_data,function(res){
					$scope.watch_getList();
					$scope.add_flag=false;
					$scope.$apply();
					$scope.update_view($scope.data);
				},"json")
			}
			
			$scope.$watch("tag_name",function(value){
				if(!value)return;
			
				$scope.add_flag=$scope.list.some(function(value){
					return $scope.tagName[value.child_id]==$scope.tag_name;
				})
			},1)
			$scope.$watch("data.sync_relation",function(sync_relation){
				if(sync_relation*1){
					$scope.sync_relation($scope.levelList,$scope.index,0);
				}
			},1)
        },
    }
}]);