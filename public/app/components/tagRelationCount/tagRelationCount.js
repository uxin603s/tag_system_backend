angular.module("app").component("tagRelationCount",{
	bindings:{
		levelIndex:"=",
	},
	templateUrl:'app/components/tagRelationCount/tagRelationCount.html?t='+Date.now(),
	controller:["$scope","cache","tagName","tagRelation","tagRelationCount",function($scope,cache,tagName,tagRelation,tagRelationCount){
		$scope.cache=cache;
		$scope.tag={};
		
		$scope.delete_level=function(id){
			if(!confirm("確認刪除?")){
				return;
			}
			var post_data={
				func_name:'TagRelationLevel::delete',
				arg:{
					id:id,
					tid:$scope.cache.tagType.select,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					var index=$scope.cache.levelList.findIndex(function(value){
						return value.data.id==id;
					});
					if(index!=-1){
						$scope.cache.levelList.splice(index,1);
					}
					$scope.$apply();
				}
			},"json")
		}
		
		$scope.get=function(){
			clearTimeout($scope.Timer);
			$scope.Timer=setTimeout(function(){
				promiseRecursive(function* (){
					var ids;
					if($scope.tag.name){//搜尋模式
						var list=yield tagName.nameToId("%"+$scope.tag.name+"%",1)
						if(list.length){
							var ids=list.map(function(val){
								return val.id;
							});
						}
					}
					
					if($scope.$ctrl.levelIndex){
						if(isNaN(cache.levelList[$scope.$ctrl.levelIndex-1].select)){
							$scope.cache.levelList[$scope.$ctrl.levelIndex].list=[];
							$scope.$apply();
							yield Promise.reject("沒選上一層");
						}else{
							var levelList_data=$scope.cache.levelList[$scope.$ctrl.levelIndex-1];
							var level_id=levelList_data.data.id;
							var id=levelList_data.select;
							var where_list=[
								{field:'level_id',type:0,value:level_id},
								{field:'id',type:0,value:id},
							];
							for(var i in ids){
								where_list.push({field:'child_id',type:0,value:ids[i]})
							}
							var res= yield tagRelation.get(where_list);
							if(res.status){
								var alias_sort_id={};
								var ids=[];
								for(var i in res.list){
									var data=res.list[i];
									
									var sort_id=data.sort_id;
									var child_id=data.child_id;
									ids.push(child_id);
									alias_sort_id[child_id]=sort_id
								}
							}else{
								$scope.cache.levelList[$scope.$ctrl.levelIndex].list=[];
								$scope.$apply();
								yield Promise.reject("沒有關聯");
							}
						}
					}
					var levelList_data=$scope.cache.levelList[$scope.$ctrl.levelIndex];
					var level_id=levelList_data.data.id;
					var where_list=[
						{field:'level_id',type:0,value:level_id},
					];
					if(ids){
						for(var i in ids){
							where_list.push({field:'id',type:0,value:ids[i]})
						}
					}
					var res=yield tagRelationCount.get(where_list);
					if(res.status){
						
						if(alias_sort_id){
							for(var i in res.list){
								res.list[i].sort_id=alias_sort_id[res.list[i].id]
							}
						}
						res.list.sort(function(a,b){
							return a.sort_id-b.sort_id;
						})
						$scope.cache.levelList[$scope.$ctrl.levelIndex].list=res.list;
						
						var ids=res.list.map(function(val){
							return val.id;
						})
						yield tagName.idToName(ids);
						$scope.$apply();
					}
					else{
						yield Promise.reject("tagRelationCount 沒資料");
					}
				}())
			},500)
		}
		
		$scope.$watch("tag.name",$scope.get,1);
		$scope.$watch("cache.levelList",function(levelList){
			if(!levelList)return;
			
			$scope.$watch("cache.levelList["+($scope.$ctrl.levelIndex-1)+"].select",function(select){
				$scope.get();
				// console.log("第"+$scope.$ctrl.levelIndex+"層，select",select)
			},1);
			$scope.$watch("cache.levelList["+($scope.$ctrl.levelIndex)+"].list.length",function(length){
				if(length==0){
					delete $scope.cache.levelList[$scope.$ctrl.levelIndex].select;
				}
			})
			$scope.$watch("cache.levelList["+($scope.$ctrl.levelIndex)+"].list",function(curr,prev){
				return
				if(!curr)return;
				if(!prev)return;
				
				clearTimeout($scope.sort_id_timer);
				$scope.sort_id_timer=setTimeout(function(){
					for(var i in curr){
						if(curr[i])
						if(prev[i])
						if(curr[i].sort_id!=prev[i].sort_id){
							// console.log(curr[i],prev[i])
							if($scope.$ctrl.levelIndex){
								var id=$scope.cache.levelList[$scope.$ctrl.levelIndex-1].select;
								var level_id=$scope.cache.levelList[$scope.$ctrl.levelIndex-1].data.id;
								var child_id=curr[i].id
								var sort_id=curr[i].sort_id
								//update tagRelation
								//id,child_id,level_id
								
								tagRelation.ch({
									update:{
										sort_id:sort_id
									},
									where:{
										id:id,
										level_id:level_id,
										child_id:child_id,
									},
								})
								.then(function(res){
									console.log(res);
								})
								// console.log(id,child_id,level_id,sort_id)
							}else{
								//update tagRelationCount
								//id,level_id
								var id=curr[i].id
								var level_id=$scope.cache.levelList[$scope.$ctrl.levelIndex].data.id;
								var sort_id=curr[i].sort_id;
								tagRelationCount.ch({
									update:{
										sort_id:sort_id
									},
									where:{
										id:id,
										level_id:level_id,
									},
								})
								.then(function(res){
									console.log(res);
								})
								// console.log(id,level_id,sort_id)
							}
						}
					}
				},500)
				if(!$scope.tag.name){
					curr.sort(function(a,b){
						return a.sort_id-b.sort_id;
					})
					
					curr.map(function(val,key){
						val.sort_id=key;
					})
				}
			},1)
		});
		
		$scope.add=function(name){
			promiseRecursive(function* (name){
				var list=yield tagName.nameToId(name);
				var child_id=list.pop().id;
					
				if($scope.$ctrl.levelIndex){
					if(isNaN(cache.levelList[$scope.$ctrl.levelIndex-1].select)){
						var message="請選擇上一層"
						alert(message);
						yield Promise.reject(message);
					}else{
						if(cache.levelList[$scope.$ctrl.levelIndex-1].select==child_id){
							var message="不能跟父層同名"
							alert(message);
							yield Promise.reject(message);
						}else{	
							var levelList_data=$scope.cache.levelList[$scope.$ctrl.levelIndex-1];
							var level_id=levelList_data.data.id;
							var id=levelList_data.select;
							var add={
								level_id:level_id,
								id:id,
								child_id:child_id,
								sort_id:99999,
							}
							
							var item=yield tagRelation.add(add);
							var child_id=item.child_id;
						}
					}
				}
				// console.log($scope.$ctrl.levelIndex)
				var levelList_data=$scope.cache.levelList[$scope.$ctrl.levelIndex];
				var level_id=levelList_data.data.id;
				
				yield tagRelationCount.add({
					level_id:level_id,
					id:child_id,
				})
				.catch(function(message){
					alert(message)
					console.log(message)
				});
				
				// console.log($scope.tag);
				
				$scope.tag.name='';
				$scope.$apply();
			}(name))
		}
		
		$scope.del=function(index){
			if(!confirm("確認刪除?")){
				return;
			}
			promiseRecursive(function* (index){
				var levelList_data=$scope.cache.levelList[$scope.$ctrl.levelIndex];
				var level_id=levelList_data.data.id;
				var id=levelList_data.list[index].id;
				var child_level_id=level_id;
				var child_id=id;
				
				if($scope.$ctrl.levelIndex){//第一層沒有關聯;
					let levelList_data=$scope.cache.levelList[$scope.$ctrl.levelIndex-1];
					let level_id=levelList_data.data.id;
					let id=levelList_data.select;
					var del={
						level_id:level_id,
						id:id,
						child_id:child_id,
					}
					yield tagRelation.del(del);
				}
				var result=yield tagRelationCount.del({
					level_id:level_id,
					id:id,
				})
				// console.log(result,del)
				if(!result.status && del){
					yield tagRelation.add(del);
				}
				
			}(index));
		}
	}]
});