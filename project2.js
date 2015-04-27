	var gl;
	var play = true;
    function initGL(Canevas) {
    	try {
        	gl = Canevas.getContext("experimental-webgl");
            gl.viewportWidth = Canevas.width;
            gl.viewportHeight = Canevas.height;
                } catch (e) {
                }
                if (!gl) {
                    alert("WebGL not supported.");
                }
            }     
            function getShader(gl, id) {
                var shaderScript = document.getElementById(id);
                if (!shaderScript) {
                    return null;
                }   
                var str = "";
                var k = shaderScript.firstChild;
                while (k) {
                    if (k.nodeType == 3) {
                        str += k.textContent;
                    }
                    k = k.nextSibling;
                }
                var shader;
                if (shaderScript.type == "x-shader/x-fragment") {
                shader = gl.createShader(gl.FRAGMENT_SHADER);
                } else if (shaderScript.type == "x-shader/x-vertex") {
                    shader = gl.createShader(gl.VERTEX_SHADER);
                } else {
                    return null;
                }       
                gl.shaderSource(shader, str);
                gl.compileShader(shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    alert(gl.getShaderInfoLog(shader));
                    return null;
                }
                return shader;
            }
    
            var shaderProgram;
        
            function initShaders() {
                var fragmentShader = getShader(gl, "shader-fs");
                var vertexShader = getShader(gl, "shader-vs");
        
                shaderProgram = gl.createProgram();
                gl.attachShader(shaderProgram, vertexShader);
                gl.attachShader(shaderProgram, fragmentShader);
                gl.linkProgram(shaderProgram);
        
                if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                    alert("Shaders not initl ...");
                }
        
                gl.useProgram(shaderProgram);
        
                shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
                gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

                shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
                gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
       
                shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
                shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
            }
        
            function mvPushMatrix() {
                var copy = mat4.create();
                mat4.set(mvMatrix, copy);
                mvMatrixPile.push(copy);
            }
            function mvPopMatrix() {
                mvMatrix = mvMatrixPile.pop();
            }     
        
            var mvMatrix = mat4.create();
            var pMatrix = mat4.create();
            var mvMatrixPile = [];
                
            function UniformiserLesMatrices() {
                gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
                gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
            }
        
            var cubeVertexPositionBuffer;
            var cubeVertexColorBuffer;
            var cubeVertexIndexBuffer;
			var path;
       
            function initBuffers() {
				path = [[0,0],[0,1],[1,0],[0,1],[1,0],[1,0],[1,0],[0,1]];
				var depl_x = 0;
				var depl_z = 0;
				vertices = [];
				color = [];
				indices = [];


				rectVertexPositionBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, rectVertexPositionBuffer);
				for (var i =0; i<path.length;i++) {
					depl_x = depl_x + path[i][0]*2; 
					depl_z = depl_z + path[i][1]*2;
					face = [
					-1 + depl_x , -1 , -1 - depl_z , 
					1 + depl_x , -1 , -1 - depl_z ,
					1 + depl_x , -1 , 1 - depl_z ,
					-1 + depl_x , -1 , 1 - depl_z, 
					];

					var col = i/path.length;

					var buffColor = [
						col, col, col, 1.0,
						col, col, col, 1.0,
						col, col, col, 1.0,
						col, col, col, 1.0
					];

					var buffVertexIndices = [
						4*i,    4*i+1,  4*i+2,
						4*i,    4*i+2,  4*i+3
					];

					vertices = vertices.concat(face);
					color = color.concat(buffColor);
					indices = indices.concat(buffVertexIndices);
				}


				tempBuffVertices = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, tempBuffVertices);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
				tempBuffVertices.itemSize = 3;
				tempBuffVertices.numItems = 32;
				tempBuffColors = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, tempBuffColors);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
				tempBuffColors.itemSize = 4;
				tempBuffColors.numItems = 32;
				
				tempBuffIndices = gl.createBuffer();
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tempBuffIndices);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
				tempBuffIndices.itemSize = 1;
				tempBuffIndices.numItems = indices.length;
				
			
                cubeVertexPositionBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
                var points = [
                  
                    -1.0, -1.0,  1.0,
                     1.0, -1.0,  1.0,
                     1.0,  1.0,  1.0,
                    -1.0,  1.0,  1.0,
                    
                    -1.0, -1.0, -1.0,
                    -1.0,  1.0, -1.0,
                     1.0,  1.0, -1.0,
                     1.0, -1.0, -1.0,
                    
                    -1.0,  1.0, -1.0,
                    -1.0,  1.0,  1.0,
                     1.0,  1.0,  1.0,
                     1.0,  1.0, -1.0,
                    
                    -1.0, -1.0, -1.0,
                     1.0, -1.0, -1.0,
                     1.0, -1.0,  1.0,
                    -1.0, -1.0,  1.0,
                    
                     1.0, -1.0, -1.0,
                     1.0,  1.0, -1.0,
                     1.0,  1.0,  1.0,
                     1.0, -1.0,  1.0,
                   
                    -1.0, -1.0, -1.0,
                    -1.0, -1.0,  1.0,
                    -1.0,  1.0,  1.0,
                    -1.0,  1.0, -1.0
                ];
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
                cubeVertexPositionBuffer.itemSize = 3;
                cubeVertexPositionBuffer.numItems = 24;
             
                cubeVertexColorBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
                var colors = [
                    [1.0, 0.0, 0.0, 1], 
                    [1.0, 1.0, 0.0, 1], 
                    [0.0, 1.0, 0.0, 1], 
                    [1.0, 0.5, 0.5, 1], 
                    [1.0, 0.0, 1.0, 1], 
                    [0.0, 0.0, 1.0, 1]  
                ];
                var tabColors = [];
                for (var i in colors) {
                    var color = colors[i];
                    for (var j=0; j < 4; j++) {
                        tabColors = tabColors.concat(color);
                    }
                }
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tabColors), gl.STATIC_DRAW);
                cubeVertexColorBuffer.itemSize = 4;
                cubeVertexColorBuffer.numItems = 24;
        
                cubeVertexIndexBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
                var cubeVertexIndices = [
                    0, 1, 2,      0, 2, 3,    
                    4, 5, 6,      4, 6, 7,    
                    8, 9, 10,     8, 10, 11,  
                    12, 13, 14,   12, 14, 15, 
                    16, 17, 18,   16, 18, 19, 
                    20, 21, 22,   20, 22, 23  
                ];
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
                cubeVertexIndexBuffer.itemSize = 1;
                cubeVertexIndexBuffer.numItems = 36;
            }

            var AngleCamera = 0;
            var AngleX = 0;
            var AngleZ = 0;
			var PosX = 0;
			var PosZ = 0;
			var temps = 0;

            function P_change() {    
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                mat4.ortho(-12.0, 12.0, -12.0, 12.0, 0.1, 100.0, pMatrix);     
                mat4.identity(mvMatrix);

                mat4.translate(mvMatrix, [0, 0, -50.0]);
				
				// Yaw 
                mat4.rotate(mvMatrix, -20* Math.PI / 180, [0, 1, 0]);
				// Pitch 
                mat4.rotate(mvMatrix, 20* Math.PI / 180, [1, 0, 0]);
			
                mat4.rotate(mvMatrix, AngleCamera* Math.PI / 180, [0, 1, 0]);
				
				mvPushMatrix();
				gl.bindBuffer(gl.ARRAY_BUFFER, tempBuffVertices);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, tempBuffVertices.itemSize, gl.FLOAT, false, 0, 0);
              
                gl.bindBuffer(gl.ARRAY_BUFFER, tempBuffColors);
                gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, tempBuffColors.itemSize, gl.FLOAT, false, 0, 0);
               
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tempBuffIndices);
                UniformiserLesMatrices();
                gl.drawElements(gl.TRIANGLES, tempBuffIndices.numItems, gl.UNSIGNED_SHORT, 0);
				mvPopMatrix();
				
				mvPushMatrix();
				
				mat4.translate(mvMatrix, [PosX*2, 0, PosZ*2]);
                mat4.rotate(mvMatrix, AngleZ* Math.PI / 180, [1, 0, 0]);
                mat4.rotate(mvMatrix, AngleX* Math.PI / 180, [0, 1, 0]);

                gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
                
                gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
                UniformiserLesMatrices();
                gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
				mvPopMatrix();
				
				Clock();
            }
			
			function game_Condition(){
				$("#win").hide();
				var i;
				var testX = 0;
				var testZ = 0;
				var ok = false;
				for (i=0 ; i<path.length ; i++){
					testX+=path[i][0];
					testZ-=path[i][1];
					if ((testX == PosX) && (testZ == PosZ)){
						ok = true;
					}
				}
				
				if ((testX == PosX) && (testZ == PosZ)){
					$("#win").show();
				}
				
				if (!ok){
					$("#fail").show();
					play = false;
				}
			}
			
            function ModifierParams() {
				var vitesse = 0.02;
				var t = new Date().getTime();
				var y = t*vitesse;
                AngleCamera = y;
				ta = t;   
            }
			
			function Clock(){
				temps = new Date().getTime() - tempsInitial;
				centisecondes = Math.floor(temps/10)%100;
				secondes = Math.floor(temps/1000)%60;
				minutes = Math.floor(temps/60000);
				if(centisecondes<10){centisecondes="0"+centisecondes;}
				if(secondes<10){secondes="0"+secondes;}
				if(minutes<10){minutes="0"+minutes;}
				$("#Clock").html(minutes+"'"+secondes+"\""+centisecondes);
			}
			
            function Animate() {
				requestAnimFrame(Animate);
				ModifierParams();
				P_change();
				if(!play){
					tempsInitial = new Date().getTime();
					while (new Date().getTime() < tempsInitial + 1000); //Attendre une seconde
					PosX = 0;
					PosZ = 0;
					play = true;
					$("#fail").hide();
					tempsInitial = new Date().getTime();
				}
            }
			
			function decX(){
				PosX--;
				AngleX-=90;
			}
			
			function decZ(){
				PosZ--;
				AngleZ-=90;
			}
			
			function incX(){
				PosX++;
				AngleX+=90;
			}
			
			function incZ(){
				PosZ++;
				AngleZ+=90;
			}
			
			function keydown(event){
				switch(event.keyCode){
					case 37:
					decX();
					break;
					case 38:
				
					decZ();
					break;
					case 39:
					
					incX();
					break;
					case 40:
					
					incZ();
					break;
				}
				game_Condition();
			}
       
            function Launch_webGL() {
				$("#fail").hide();
				$("#win").hide();
				play = true;
				tempsInitial = new Date().getTime();
                var Canevas = document.getElementById("3DGame");
                initGL(Canevas);
                initShaders();
                initBuffers();
                gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
                gl.clearColor(0.0, 0.0, 0.0, 0.6); 
                gl.enable(gl.DEPTH_TEST);
                Animate();
            }

