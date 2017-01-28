/*globals $:false */
/*globals EXIF:false */
/*globals google:false */
/*globals escape:false */

var TIV3031 = function (){
	
	var imagesurls ={
		LoadedImages: []
	};
	var current_image;
	var current_image_id;
	var error_flag =0;
	var images_on_screen=0;
	var append_map_flag=0;
	return {
		
		loadImages: function(){
			var files = document.getElementById("images_name").files;
			for (var i = 0; i < files.length; i++) {
				if(files[i].type.indexOf("image") != -1)
					imagesurls.LoadedImages.push(files[i]);
			}
			 
		},
		
		
		
		
		getLoadedImagesURLs: function(){
			return imagesurls.LoadedImages;
		},
		
		
		
		
		showLoadedImages: function( elem){
			//error check 
			if(imagesurls.LoadedImages.length===0){
				$(elem).append("<br><br><h1><p id=\"error_message\">Error message:O fakelos den exei eikones!!</p></h1>");
				error_flag=1;
			}else{ 
				if(error_flag==1){
					console.log("error flag up");
					document.getElementById("error_message").innerHTML = "";
					error_flag=0;
				}
			}
      function aaa(file, i) {
					return function(e ) {
						console.log(file.name);
						$(elem).append(" <div class=\"TIV \"><figure><img src=\" "+e.target.result+"\" id=\"image"+(images_on_screen+i+1)+"\" onclick=\"image_zoom("+(images_on_screen+i+1)+"); \" alt=\"error loading image\" title=\""+ escape(file.name)+"\" /><figcaption></figcaption></figure></div>");
						
					};
				}
			for(var i=images_on_screen; i< imagesurls.LoadedImages.length ; i++ ){
				var file = imagesurls.LoadedImages[i];
				// Have to check that this is an image though
				// using the file.name TODO
				var reader = new FileReader();
				// Closure to capture the file information.
				reader.onload = aaa(file, i);
				// Read in the image file as a data URL.
				reader.readAsDataURL(file);
			}
			images_on_screen+=i;
		},




		showImage: function(index , elem){
			console.log("enter image_zoom");
			//creating here everything you are about to use 
			$(elem).addClass("modal");
			$(elem).append("<span class=\"close\"  onclick=\"image_close();\">X</span>");
		
			
			current_image_id =index;
			current_image ="#"+"image"+index ; 
			document.getElementsByClassName("close")[0].style.display = "block";
			$(current_image).addClass("zoom_image");
			document.getElementsByClassName("modal")[0].style.display = "block";			
		},


		

		image_close: function(){
			console.log("image_close()");
			$(current_image).removeClass("zoom_image");
			document.getElementsByClassName("close")[0].style.display = "none";
			document.getElementsByClassName("modal")[0].style.display = "none";
			$("#allMetaDataSpan").removeClass("metaData");
			document.getElementsByClassName("map_container")[0].style.display= "none";
			document.getElementsByClassName("map_container")[0].style.width= "0px";
			document.getElementsByClassName("map_container")[0].style.height= "0px";
			}, 
		
		
		
		
		
		
		showImageDetailedExifInfo: function(index, elem){
			var selectedimage = document.getElementById("image"+index);	
			EXIF.getData(selectedimage, function() {
				var allMetaData = EXIF.getAllTags(this);
				var allMetaDataSpan = document.getElementById(elem);
				allMetaDataSpan.style.display = "block";
				allMetaDataSpan.innerHTML = JSON.stringify(allMetaData, null,"\n");
			});
			$("#allMetaDataSpan").addClass("metaData");
		}, 
		
		
		
		
		
		showImageDetailedExifWithMap: function(index, elem){
			this.showImageDetailedExifInfo(index , "allMetaDataSpan");
			if(append_map_flag===0){
				$(elem).append("<div class=\"map_container\"><div class=\"map\" id=\"map\"> </div> </div>");
				append_map_flag=1;
			}
			var gpsloc= EXIF.getTag( document.getElementById("image"+index), 'GPSLongitude');
			
			if(gpsloc !== undefined ){
				document.getElementsByClassName("map_container")[0].style.display= "block";
				document.getElementsByClassName("map_container")[0].style.width= "650px";
				document.getElementsByClassName("map_container")[0].style.height= "200px";
				//heraklion coordinates
				//var uluru  ={lat: 35.3386, lng: 25.1442 };
				var uluru ={lat: gpsloc[0].numerator, lng: gpsloc[1].numerator };
				//init map	
				var map = new google.maps.Map(document.getElementById("map"), {
					center: uluru,
					scrollwheel: false,
     				size: new google.maps.Size(71, 71),
					draggable:true,
					zoom: 8
				});
				var marker = new google.maps.Marker({
					position: uluru,
				});
				marker.setMap(map);
			
			}
			$("#map").show();	

			}
	};
	
}; 	

var dokimh = new TIV3031();


function readAndShowFiles(){
	dokimh.loadImages();
	dokimh.showLoadedImages("#title");
}
	 

var imagez = new TIV3031();

function image_zoom(id){
	imagez.showImage(id, "#container");
	//imagez.showImageDetailedExifInfo(id , "allMetaDataSpan");
	imagez.showImageDetailedExifWithMap(id , "body");	
}
      
function image_close(){
	imagez.image_close();
}










