<?php header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
?>
<html>
<head>
<title>Crypto Market</title>
<!-- Latest compiled and minified CSS -->
<link href="assets/bootstrap/css/bootstrap.min.css" rel="stylesheet" >
<script src="assets/final/all.min.js"></script>
<style>
.fixed-table-body {
    overflow-x: auto;
    overflow-y: auto;
    height: 400px;
}
.table-fixed{
  width: 100%;
   tbody{
    overflow-y:auto;
    width: 100%;
    }
  thead,tbody,tr,td,th{
    display:block;
  }
  tbody{
    td{
      float:left;
    }
  }
  thead {
    tr{
      th{
        float:left;
       background-color: #f39c12;
       border-color:#e67e22;
      }
    }
  }
}

</style>
</head>

<body>

<?php 
date_default_timezone_set('America/Los_Angeles');
$minutes = date('h')*60 + date('i');
$slot  = round($minutes/5);
$url = "data/".date("Ymd")."/data".$slot.".json";
if(!file_exists($url)) {
	$url = "data/".date("Ymd")."/data".($slot-1).".json";
}

$gurl = "data/".date("Ymd")."/gdata".$slot.".json";
if(!file_exists($gurl)) {
	$url = "data/".date("Ymd")."/gdata".($slot-1).".json";
}

?>

<b>Market Capital: </b><i class="glyphicon glyphicon-usd"></i> <span id="total_market_usd">  </span>

<b>24Hr Volume: </b> <i class="glyphicon glyphicon-usd"></i>  <span id="volume"></span>		  
		  
<table class="table table-striped table-bordered table-fixed" id="table" data-toggle="table" data-url=<?php echo $url;?> data-search="true"
           data-show-refresh="true"
           data-show-toggle="true"
           data-show-columns="true"
           data-show-export="true"
		   data-show-pagination-switch="false"
           data-pagination="true"
           data-id-field="rank"
           data-page-list="[10, 25, 50, 100, ALL]"
           data-show-footer="false"
          >
    <thead>
        <tr>
            <th data-field="rank" data-sortable="true" > #Rank </th>
            <th data-field="name" data-sortable="true" data-type="search">Name</th>
			<th data-field="symbol"  data-type="search">Symbol</th>
			<th data-field="price_usd" data-sortable="true" data-type="range" data-formatter="priceFormatter">Price</th>
			<th data-field="price_inr" data-sortable="true"> Price (Rs.) </th>
			<th data-field="market_cap_usd" data-sortable="true" data-formatter="priceFormatter">Market Capital</th>
			<th data-field="24h_volume_usd" data-sortable="true" data-type="range"> 24Hr Vol </th>
			<th data-field="available_supply" data-sortable="true" >Available Supply</th>
			<th data-field="percent_change_1h" data-sortable="true"> % 1h  </th>
			<th data-field="percent_change_24h" data-sortable="true"> % 24h </th>
			<th data-field="percent_change_7d" data-sortable="true"> % 7d </th>
			<th data-field="id" data-sortable="true" data-formatter="linkFormatter"> Link </th>
			
			
		</tr>
    </thead>
</table>

<script>

 $.ajax({
        type: 'GET',
        url: "<?php echo $gurl; ?>",
        contentType: "application/json",
        dataType: 'json',
		success: function (data) {
			$("#total_market_usd").text(data.total_market_cap_usd);
			$("#volume").text(data.total_24h_volume_usd);
			$("span").digits();
		}
		
		});
$.fn.digits = function(){ 
    return this.each(function(){ 
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
    })
}		
var $table = $('#table');
     setTimeout(function () {
            $table.bootstrapTable('resetView');
        }, 200);   
 
        $(window).resize(function () {
            $table.bootstrapTable('resetView', {
                height: getHeight()
            });
        });
		
		function getHeight() {
        return $(window).height() - $('h1').outerHeight(true);
    }
		
$(function () {
        var scripts = [
                location.search.substring(1)                
            ],
            eachSeries = function (arr, iterator, callback) {
                callback = callback || function () {};
                if (!arr.length) {
                    return callback();
                }
                var completed = 0;
                var iterate = function () {
                    iterator(arr[completed], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            if (completed >= arr.length) {
                                callback(null);
                            }
                            else {
                                iterate();
                            }
                        }
                    });
                };
                iterate();
            };

        eachSeries(scripts, getScript);
    });
	
	function priceFormatter(value) {
      
        return '<i class="glyphicon glyphicon-usd"></i>' +
                value +
                '</div>';
    }
	
	function linkFormatter(value) {
      
		var url ="https://coinmarketcap.com/currencies/"+value;
        return '<a target="_blank" href='+url+'>'+value+'</a>';
    }
	
	    function getScript(url, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = url;

        var done = false;
        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function() {
            if (!done && (!this.readyState ||
                    this.readyState == 'loaded' || this.readyState == 'complete')) {
                done = true;
                if (callback)
                    callback();

                // Handle memory leak in IE
                script.onload = script.onreadystatechange = null;
            }
        };

        head.appendChild(script);

        // We handle everything using the script element injection
        return undefined;
    }
</script>

</body>
</html>