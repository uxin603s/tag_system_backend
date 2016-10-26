<?php
class TagRelationCount{
	public static $filter_field=['id','level_id','count'];
	public static function getList($arg){
		$limit_str="";
		if(!isset($arg['pageData'])){
			$arg['pageData']['limit_count']=10;
			$arg['pageData']['limit_page']=0;
		}
		$count=$arg['pageData']['limit_count'];
		$start=$arg['pageData']['limit_page']*$count;
		$limit_str=" limit {$start} , {$count}";
		$pageData=$arg['pageData'];
		
		
		$bind_data=[];
		$where_str=MysqlCompact::where($arg['where_list'],self::$filter_field,$bind_data);		
		$sql="select * from tag_relation_count {$where_str} order by id desc,count desc {$limit_str}";//
		
		if($tmp=DB::select($sql,$bind_data)){
			$status=true;
			$list=$tmp;
			$count_sql="select * from tag_relation_count {$where_str} ";
			
			$pageData['total_count']=count(DB::select($count_sql,$bind_data));
		}else{
			$pageData['total_count']=0;
			$status=false;
		}
		return compact(['status','list','sql','bind_data','pageData']);
	}
	public static function insert($insert){
		DB::insert($insert,"tag_relation_count");
		$insert['count']=0;
		return $insert;
	}
	public static function delete($arg){
		$where=[];
		$where['id']=$arg['id'];
		$where['level_id']=$arg['level_id'];
		$where['count']=0;//確保移除的是count等於0
		$where_list=[
			['field'=>'child_id','type'=>0,'value'=>$arg['id']],
			['field'=>'level_id','type'=>0,'value'=>$arg['p_level_id']],
		];
		$tmp=TagRelation::getList(compact(["where_list"]));//確保別的人沒有關聯才刪除
		if($tmp['status']){
			$status=true;
			$message="刪除成功";
		}else{
			if(DB::delete($where,"tag_relation_count")){
				$status=true;
				$message="刪除成功";
			}else{
				$status=false;
				$message="刪除失敗";
			}
		}
		
		return compact(['arg','tmp','where','status','message',]);
	}
}