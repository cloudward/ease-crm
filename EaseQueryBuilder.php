<?php

class EaseQueryBuilder
{

    public static function retrieveTagEntitiesId($tagsArr, $ease, $moduleId)
    {
        $tagsCommaStr = "";

        foreach($tagsArr as $tagStr)
        {
            $tagsCommaStr .= $ease->core->db->quote(trim($tagStr)) . ",";
        }

        $tagsCommaStr = substr($tagsCommaStr, 0, strlen($tagsCommaStr) - 1);

        $query = "select uuid, name from easetags where name in ($tagsCommaStr)";

        $stmt = $ease->ease_db_query($query);

        $res = $ease->ease_db_fetch_all($stmt);

        $resTags = array();

        foreach($res as $resObj)
        {
            $resTags[$resObj['name']] = $resObj['uuid'];
        }

        $finalTagIds = array();

        $resEntities = array();

        foreach($tagsArr as $inputTag)
        {
            if(isset($resTags[$inputTag]))
                $finalTagIds[] = $resTags[$inputTag];
//            else
//                $resEntities[] = $inputTag;
        }

        if(sizeof($finalTagIds) > 0)
        {
            foreach($finalTagIds as &$tagId)
            {
                $tagId = '"' . $tagId . '"';
            }

            $entities_query = "select distinct(entityid) from easetagsentities where tagid in (" . implode(",", $finalTagIds) . ") and moduleid=\"" . $moduleId . "\"";

            $stmt = $ease->ease_db_query($entities_query);

            $res = $ease->ease_db_fetch_all($stmt);

            foreach($res as $resObj)
            {
                $resEntities[] = $resObj['entityid'];
            }
        }

        return $resEntities;
    }

    public static function replaceTagId($tagsArr, $ease)
    {
        $tagsCommaStr = "";

        foreach($tagsArr as $tagStr)
        {
            $tagsCommaStr .= $ease->core->db->quote(trim($tagStr)) . ",";
        }

        $tagsCommaStr = substr($tagsCommaStr, 0, strlen($tagsCommaStr) - 1);

        $query = "select uuid, name from easetags where name in ($tagsCommaStr)";

        $stmt = $ease->ease_db_query($query);

        $res = $ease->ease_db_fetch_all($stmt);

        $resTags = array();

        foreach($res as $resObj)
        {
            $resTags[$resObj['name']] = $resObj['uuid'];
        }

        $finalTagIds = array();

//        $resEntities = array();

        foreach($tagsArr as $inputTag)
        {
            if(isset($resTags[$inputTag]))
                $finalTagIds[] = $resTags[$inputTag];
            else
                $finalTagIds[] = $inputTag;
        }

        /*if(sizeof($finalTagIds) > 0)
        {
            foreach($finalTagIds as &$tagId)
            {
                $tagId = '"' . $tagId . '"';
            }

            $entities_query = "select distinct(entityid) from easetagsentities where tagid in (" . implode(",", $finalTagIds) . ") and moduleid=\"" . $moduleId . "\"";

            $stmt = $ease->ease_db_query($entities_query);

            $res = $ease->ease_db_fetch_all($stmt);

            foreach($res as $resObj)
            {
                $resEntities[] = $resObj['entityid'];
            }
        }*/

        return $finalTagIds;
    }

    public static function prepareQuery($criteria)
    {
        $queries = array();

        foreach($criteria as $queryCriteriaObj)
        {
            switch($queryCriteriaObj['key'])
            {
                case "industry":
                    $queries[] = self::prepare_industry_query($queryCriteriaObj);
                    break;
                case "source":
                    $queries[] = self::prepare_source_query($queryCriteriaObj);
                    break;
                case "territory":
                    $queries[] = self::prepare_territory_query($queryCriteriaObj);
                    break;
                case "created_on":
                    $queries[] = self::prepare_created_on_query($queryCriteriaObj);
                    break;
                case "dueDate":
                    $queries[] = self::prepare_dueDate_query($queryCriteriaObj);
                    break;
                case "expectedDate":
                    $queries[] = self::prepare_expectedDate_query($queryCriteriaObj);
                    break;
                case "stage":
                    $queries[] = self::prepare_stage_query($queryCriteriaObj);
                    break;
                case "amount":
                    $queries[] = self::prepare_amount_query($queryCriteriaObj);
                    break;
                case "confidenceLevel":
                    $queries[] = self::prepare_confidenceLevel_query($queryCriteriaObj);
                    break;
                case "tags":
                    $queries[] = self::prepare_tags_query($queryCriteriaObj);
                    break;
                case "assignedTo":
                    $queries[] = self::prepare_assignedTo_query($queryCriteriaObj);
                    break;
                case "taskType":
                    $queries[] = self::prepare_taskType_query($queryCriteriaObj);
                    break;
                case "contactSearch":
                    $queries[] = self::prepare_contactSearch_query($queryCriteriaObj);
                    break;
                case "accountSearch":
                    $queries[] = self::prepare_accountSearch_query($queryCriteriaObj);
                    break;
                case "leadSearch":
                    $queries[] = self::prepare_leadSearch_query($queryCriteriaObj);
                    break;
                case "taskAndActivitySearch":
                    $queries[] = self::prepare_taskAndActivitySearch_query($queryCriteriaObj);
                    break;
                /* case "status":
                     $queries[] = self::prepare_status_query($queryCriteriaObj);
                     break;*/
            }
        }

        $query = "";

        foreach($queries as $singleQuery)
        {
            if($singleQuery != "")
                $query .= " " . $singleQuery . " and";
        }

        $query = substr($query, 0, strlen($query) - 4);

        return $query;
    }

    private static function getOperatorString($operator)
    {
        switch($operator)
        {
            case "is":
            case "=":
            case "==":
            case "===":
                $operatorStr = "==";
                break;
            case "<":
            case "less than":
                $operatorStr = "<";
                break;
            case ">":
            case "greater than":
                $operatorStr = ">";
                break;
            case ">=":
            case "greater or equal":
                $operatorStr = ">=";
                break;
            case "<=":
            case "less or equal":
                $operatorStr = "==";
                break;
            case "is not":
            case "!=":
            case "!==":
            case "<>":
                $operatorStr = "!=";
                break;
            case "like":
            case "~":
                $operatorStr = "~";
                break;
            default:
                $operatorStr = $operator;
                break;
        }

        return $operatorStr;
    }

    private static function prepare_industry_query($criteria)
    {
        $query = "(";

        $operator = self::getOperatorString($criteria['operator']);
        $industries = $criteria['value'];

        if($operator != "!=")
        {
            $operationType = "or";
        }
        else
        {
            $operationType = "and";
        }

        foreach($industries as $value)
        {

            $query .= ' industry ' . $operator . ' "' . $value . '" ' . $operationType;
        }

        $query = substr($query, 0, strlen($query) - 3);
        $query .= ")";

        return $query;
    }

    private static function prepare_taskType_query($criteria)
    {
        $query = "(";

        $operator = self::getOperatorString($criteria['operator']);
        $taskType = $criteria['value'];

        if($operator != "!=")
        {
            $operationType = "or";
        }
        else
        {
            $operationType = "and";
        }

        foreach($taskType as $value)
        {
            $query .= ' taskType ' . $operator . ' "' . $value . '" ' . $operationType;
        }

        $query = substr($query, 0, strlen($query) - 3);

        $query .= ")";

        return $query;
    }

    private static function prepare_stage_query($criteria)
    {
        $query = "(";

        $operator = self::getOperatorString($criteria['operator']);
        $taskType = $criteria['value'];

        if($operator != "!=")
        {
            $operationType = "or";
        }
        else
        {
            $operationType = "and";
        }

        foreach($taskType as $value)
        {
            $query .= ' stage ' . $operator . ' "' . $value . '" ' . $operationType;
        }

        $query = substr($query, 0, strlen($query) - 3);

        $query .= ")";

        return $query;
    }

    private static function prepare_source_query($criteria)
    {
        $query = "(";

        $operator = self::getOperatorString($criteria['operator']);
        $sources = $criteria['value'];

        if($operator != "!=")
        {
            $operationType = "or";
        }
        else
        {
            $operationType = "and";
        }

        foreach($sources as $value)
        {
            $query .= ' source ' . $operator . ' "' . $value . '" ' . $operationType;
        }

        $query = substr($query, 0, strlen($query) - 3);

        $query .= ")";

        return $query;
    }

    private static function prepare_territory_query($criteria)
    {
        $query = "(";

        $operator = self::getOperatorString($criteria['operator']);
        $territories = $criteria['value'];

        if($operator != "!=")
        {
            $operationType = "or";
        }
        else
        {
            $operationType = "and";
        }

        foreach($territories as $value)
        {
            $query .= ' territory ' . $operator . ' "' . $value . '" ' . $operationType;
        }

        $query = substr($query, 0, strlen($query) - 3);

        $query .= ")";

        return $query;
    }

    private static function prepare_created_on_query($criteria)
    {
        $operator = self::getOperatorString($criteria['operator']);
        $values = $criteria['value'];

        if($operator != "between")
            $query = '(created_on ' . $operator . ' "' . $values . '")';
        else
        {
            $startValue = $values['start'];
            $endValue = $values['end'];
            $query = '(created_on > "' . $startValue . '" and ';
            $query .= 'created_on < "' . $endValue . '");';
        }

        return $query;
    }

    private static function prepare_amount_query($criteria)
    {
        $operator = self::getOperatorString($criteria['operator']);
        $values = $criteria['value'];

        if($operator != "between")
            $query = '(amount ' . $operator . ' "' . $values . '")';
        else
        {
            $startValue = $values['start'];
            $endValue = $values['end'];
            $query = '(amount > "' . $startValue . '" and ';
            $query .= 'amount < "' . $endValue . '");';
        }

        return $query;
    }

    private static function prepare_confidenceLevel_query($criteria)
    {
        $operator = self::getOperatorString($criteria['operator']);
        $values = $criteria['value'];

        if($operator != "between")
            $query = '(confidencelevel ' . $operator . ' "' . $values . '")';
        else
        {
            $startValue = $values['start'];
            $endValue = $values['end'];
            $query = '(confidencelevel > "' . $startValue . '" and ';
            $query .= 'confidencelevel < "' . $endValue . '");';
        }

        return $query;
    }

    private static function prepare_expectedDate_query($criteria)
    {
        $operator = self::getOperatorString($criteria['operator']);
        $values = $criteria['value'];

        if($operator != "between")
            $query = '(expectedDate ' . $operator . ' "' . $values . '")';
        else
        {
            $startValue = $values['start'];
            $endValue = $values['end'];
            $query = '(expectedDate > "' . $startValue . '" and ';
            $query .= 'expectedDate < "' . $endValue . '");';
        }

        return $query;
    }

    private static function prepare_dueDate_query($criteria)
    {
        $operator = self::getOperatorString($criteria['operator']);
        $values = $criteria['value'];

        if($operator != "between")
            $query = '(dueDate ' . $operator . ' "' . $values . '")';
        else
        {
            $startValue = $values['start'];
            $endValue = $values['end'];
            $query = '(dueDate > "' . $startValue . '" and ';
            $query .= 'dueDate < "' . $endValue . '");';
        }

        return $query;
    }

    private static function prepare_tags_query($criteria)
    {
        $query = "(";

        $operationType = $criteria['operationType'];

        $tags = $criteria['value'];

        if(sizeof($tags) > 0)
        {
            if($operationType == "any")
            {
                $query .= "uuid in \"";

                foreach($tags as $value)
                {
                    $query .= $value . ',';
                }

                $query = substr($query, 0, strlen($query) - 1);

                $query .= "\"";

                $query .= ")";
            }
            else
            {
                $operationType = "and";
                $query = "";
            }
        }
        else
            $query = "";


        return $query;
    }

    private static function prepare_assignedTo_query($criteria)
    {
        $query = "(";

        $operator = self::getOperatorString($criteria['operator']);
        $territories = $criteria['value'];

        if($operator != "!=")
        {
            $operationType = "or";
        }
        else
        {
            $operationType = "and";
        }

        foreach($territories as $value)
        {
            $query .= ' assignedTo ' . $operator . ' "' . $value . '" ' . $operationType;
        }

        $query = substr($query, 0, strlen($query) - 3);

        $query .= ")";

        return $query;
    }

    /*private static function prepare_status_query($criteria)
    {
        $query = "(";

        $status = $criteria['value'];

        $query .= '     status is "' . $status . '" if set';

        $query .= ")";

        return $query;
    }*/

    private static function prepare_taskAndActivitySearch_query($criteria)
    {
        $query = "(";

        $search = $criteria['value'];


        $query .= ' title contains "' . $search . '" or easeCRMContacts.fname contains "' . $search . '" or easeCRMAccounts.name contains "' . $search . '" or easeCRMLeads.title contains "' . $search . '" or easeCRMTaskTypes.name contains "' . $search . '" or easeUsers.fname contains "' . $search . '"';

        $query .= ")";

        return $query;
    }


    private static function prepare_leadSearch_query($criteria)
    {
        $query = "(";

        $search = $criteria['value'];


        $query .= ' title contains "' . $search . '" or easeCRMContacts.fname contains "' . $search . '" or easeCRMAccounts.name contains "' . $search . '" or amount contains "' . $search . '" or confidenceLevel contains "' . $search . '" or easeCRMProducts.name contains "' . $search . '" or easeCRMSources.name contains "' . $search . '" or easeCRMIndustries.name contains "' . $search . '" or easeUsers.fname contains "' . $search . '" or easeCRMStages.name contains "' . $search . '"';

//        $query = substr($query, 0, strlen($query) - 3);

        $query .= ")";

        return $query;
    }

    private static function prepare_accountSearch_query($criteria)
    {
        $query = "(";

        $search = $criteria['value'];


        $query .= ' name contains "' . $search . '"  or workEmail contains "' . $search . '" or workPhone contains "' . $search . '" or easeCRMSources.name contains "' . $search . '" or easeCRMIndustries.name contains "' . $search . '" or territory contains "' . $search . '" or easeUsers.fname contains "' . $search . '"';


//        $query = substr($query, 0, strlen($query) - 3);

        $query .= ")";

        return $query;
    }

    private static function prepare_contactSearch_query($criteria)
    {
        $query = "(";

        $search = $criteria['value'];


        $query .= ' fname contains "' . $search . '" or lname contains "' . $search . '" or designation contains "' . $search . '" or easeCRMAccounts.name contains "' . $search . '" or workEmail contains "' . $search . '" or workPhone contains "' . $search . '" or easeCRMSources.name contains "' . $search . '" or easeCRMIndustries.name contains "' . $search . '" or territory contains "' . $search . '" or easeUsers.fname contains "' . $search . '"';


//        $query = substr($query, 0, strlen($query) - 3);

        $query .= ")";

        return $query;
    }


}
