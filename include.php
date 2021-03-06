<?php
include_once __DIR__."/github/Cache/Fcache.php";
include_once __DIR__."/github/Cache/Mcache.php";
include_once __DIR__."/github/Cache/Cache.php";


include_once __DIR__."/github/DB/DB.php";
include_once __DIR__."/github/MysqlCompact/MysqlCompact.php";
include_once __DIR__."/github/MysqlCompact/CRUD.php";

include_once __DIR__."/github/UserSystemHelp/UserSystemHelp.php";

include_once __DIR__."/WebList.php";
include_once __DIR__."/TagType.php";
include_once __DIR__."/WebTagType.php";
include_once __DIR__."/TagName.php";

include_once __DIR__."/TagRelation.php";

include_once __DIR__."/TagLevel.php";
include_once __DIR__."/TagTree.php";
include_once __DIR__."/WebRelation.php";

Mcache::$prefix="cfd_chichi_tag";
