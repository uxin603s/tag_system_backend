<?php
class TagRelationCount{
	public static function getList($arg){
		$where_str="";
		$where=[];
		if(isset($arg['name']) && $arg['name']!=""){
			$tag_data=Tag::getList($arg['name']);
			if($tag_data['status']){
				$where[]="id in (".implode(",",array_column($tag_data['list'],"id")).") ";
			}else{
				$where[]="id = false";
			}
		}
		if(isset($arg['level_id'])){
			$where[]="level_id = ?";
			$bind_data[]=$arg['level_id'];
		}
		if(count($where)){
			$where_str.=" where ";
			$where_str.=implode(" && ",$where);
		}
		$sql="select * from tag_relation_count {$where_str} order by count desc";
		if($tmp=DB::select($sql,$bind_data)){
			$status=true;
			$list=$tmp;
		}else{
			$status=false;
		}
		return compact(['status','list','sql','bind_data']);
	}
	public static function insert($arg){
		if(isset($arg['name'])){
			$tag_data=Tag::insert($arg['name']);
			$id=$tag_data['id'];
		}else if(isset($arg['id'])){
			$id=$arg['id'];
		}else{
			return [];
		}
		
		$level_id=$arg['level_id'];
		$count=0;
		$insert=compact(['id','level_id','count']);
		DB::insert($insert,"tag_relation_count");
		return compact(['insert']);
	}
	public static function delete($arg){
		$where=$arg;
		if(DB::delete($where,"tag_relation_count")){
			TagRelation::delete($arg);
			$status=true;
			$message="刪除成功";
		}else{
			$status=false;
			$message="刪除失敗";
		}
		return compact(['status','message']);
	}
}