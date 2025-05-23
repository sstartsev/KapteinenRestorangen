const terrainShader = {
    vertexShader: `
        varying vec2 vUv;
        varying float vHeight;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
            vUv = uv;
            vHeight = position.y;
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D sandTexture;
        uniform sampler2D dirtTexture;
        uniform sampler2D cobbleTexture;
        uniform sampler2D grassTexture;
        uniform sampler2D rocksTexture;
        uniform sampler2D wornRockTexture;
        uniform sampler2D snowPackedTexture;
        uniform sampler2D rockSnowTexture;
        
        varying vec2 vUv;
        varying float vHeight;
        varying vec3 vNormal;
        varying vec3 vPosition;

        vec4 triplanarMapping(sampler2D tex, vec3 position, vec3 normal) {
            vec2 uvX = position.zy * 32.05;
            vec2 uvY = position.xz * 32.05;
            vec2 uvZ = position.xy * 0.05;

            vec4 colorX = texture2D(tex, uvX);
            vec4 colorY = texture2D(tex, uvY);
            vec4 colorZ = texture2D(tex, uvZ);

            vec3 blend = abs(normal);
            blend = normalize(max(blend, 0.00001));
            blend /= dot(blend, vec3(1.0));

            return colorX * blend.x + colorY * blend.y + colorZ * blend.z;
        }

        vec4 getTextureColor(sampler2D tex) {
            return triplanarMapping(tex, vPosition, vNormal);
        }

        vec4 blendTextures(float height) {
            vec4 sand = getTextureColor(sandTexture);
            vec4 dirt = getTextureColor(dirtTexture);
            vec4 cobble = getTextureColor(cobbleTexture);
            vec4 grass = getTextureColor(grassTexture);
            vec4 rocks = getTextureColor(rocksTexture);
            vec4 wornRock = getTextureColor(wornRockTexture);
            vec4 snowPacked = getTextureColor(snowPackedTexture);
            vec4 rockSnow = getTextureColor(rockSnowTexture);

            vec4 color;
            if (height < 2.0) {
                color = mix(sand, dirt, smoothstep(0.0, 2.0, height));
            } else if (height < 5.0) {
                color = mix(dirt, grass, smoothstep(2.0, 5.0, height));
            } else if (height < 10.0) {
                color = mix(grass, rocks, smoothstep(5.0, 10.0, height));
            } else if (height < 15.0) {
                color = mix(rocks, wornRock, smoothstep(10.0, 15.0, height));
            } else if (height < 20.0) {
                color = mix(wornRock, snowPacked, smoothstep(15.0, 20.0, height));
            } else {
                color = mix(snowPacked, rockSnow, smoothstep(20.0, 25.0, height));
            }
            return color;
        }
        
        void main() {
            vec4 color = blendTextures(vHeight);
            gl_FragColor = color;
        }
    `
};

export default terrainShader;