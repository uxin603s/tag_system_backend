<!DOCTYPE html>
<html>
<head>
	<title></title>
	<script src="js/jquery-1.12.4.min.js?t=<?=time()?>"></script>
	<script src="js/angular-1.5.8.min.js?t=<?=time()?>"></script>
	<script src="js/localForage-1.4.2.min.js?t=<?=time()?>"></script>
	<script src="js/promiseRecursive.js?t=<?=time()?>"></script>
	<script src="js/postMessageHelper/postMessageHelper.js?t=<?=time()?>"></script>
	
	<script src="app/app.js?t=<?=time()?>"></script>
	
	<script src="app/factories/cache.js?t=<?=time()?>"></script>
	<script src="app/factories/tagName.js?t=<?=time()?>"></script>
	<script src="app/factories/aliasList.js?t=<?=time()?>"></script>
	<script src="app/factories/tagRelation.js?t=<?=time()?>"></script>
	
	<script src="app/factories/idRelation.js?t=<?=time()?>"></script>
	
	<script src="app/components/index/index.js?t<?=time()?>"></script>
	<script src="app/components/tagType/tagType.js?t<?=time()?>"></script>
	<script src="app/components/tagRelationLevel/tagRelationLevel.js?t<?=time()?>"></script>
	<script src="app/components/webList/webList.js?t<?=time()?>"></script>
	
	<script src="app/components/tagRecusion/tagRecusion.js?t<?=time()?>"></script>
	
	<script src="app/components/idSearch/idSearch.js?t<?=time()?>"></script>
	<script src="app/components/tagSearch/tagSearch.js?t<?=time()?>"></script>
	
	<script src="app/components/idRelation/idRelation.js?t<?=time()?>"></script>
	
	
	<script src="app/directives/ngRightClick/ngRightClick.js?t<?=time()?>"></script>
	<script src="app/directives/ngEnter/ngEnter.js?t<?=time()?>"></script>
	<script src="app/directives/sortable/sortable.js?t<?=time()?>"></script>
	
	<link rel="stylesheet" type="text/css" href="css/bootstrap-3.3.7.min.css?t=<?=time()?>" />
	<link rel="stylesheet" type="text/css" href="css/index.css?t=<?=time()?>" />
</head>
<body ng-app="app"  style="overflow-y: scroll;" >
	<index></index>
</body>
</html>