'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { useTheme } from 'next-themes'
import * as THREE from 'three'

/**
 * Parametric 3D infinity (lemniscate of Bernoulli) with a subtle Z twist.
 */
function buildInfinityCurve(samples = 360, a = 1.7, twist = 0.42): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = []
  for (let i = 0; i < samples; i++) {
    const t = (i / samples) * Math.PI * 2
    const denom = 1 + Math.sin(t) * Math.sin(t)
    const x = (a * Math.cos(t)) / denom
    const y = (a * Math.sin(t) * Math.cos(t)) / denom
    const z = Math.sin(t * 2) * twist
    pts.push(new THREE.Vector3(x, y, z))
  }
  return new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5)
}

/**
 * Build a twisted ribbon along the curve — rectangular cross-section that
 * rotates smoothly around the tangent, giving a Möbius-like metallic ribbon.
 * Vertex colors create a blue-to-highlight gradient along the length.
 */
function buildRibbonGeometry(
  curve: THREE.CatmullRomCurve3,
  samples = 480,
  width = 0.38,
  thickness = 0.08,
  twistTurns = 1.5
): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry()
  const frames = curve.computeFrenetFrames(samples, true)

  const vertexCount = samples * 4
  const positions = new Float32Array(vertexCount * 3)
  const colors = new Float32Array(vertexCount * 3)
  const uvs = new Float32Array(vertexCount * 2)

  // Blue-palette gradient with a white highlight stop
  const cDeep = new THREE.Color('#1a3a6b')
  const cPrim = new THREE.Color('#2855a0')
  const cMid = new THREE.Color('#6b9fd4')
  const cHi = new THREE.Color('#f4f8ff')

  for (let i = 0; i < samples; i++) {
    const t = i / samples
    const point = curve.getPointAt(t)

    const tangent = frames.tangents[i]
    const binormal = frames.binormals[i].clone()
    const normal = frames.normals[i].clone()

    // Twist the cross-section around the tangent
    const twistAngle = t * Math.PI * 2 * twistTurns
    binormal.applyAxisAngle(tangent, twistAngle)
    normal.applyAxisAngle(tangent, twistAngle)

    const halfW = width / 2
    const halfT = thickness / 2

    // 4 corners of the rectangular cross-section (TL, TR, BR, BL)
    const corners = [
      point.clone().addScaledVector(binormal, halfW).addScaledVector(normal, halfT),
      point.clone().addScaledVector(binormal, -halfW).addScaledVector(normal, halfT),
      point.clone().addScaledVector(binormal, -halfW).addScaledVector(normal, -halfT),
      point.clone().addScaledVector(binormal, halfW).addScaledVector(normal, -halfT),
    ]

    // Gradient color along length (3 stops)
    let color: THREE.Color
    if (t < 0.33) {
      color = cDeep.clone().lerp(cPrim, t / 0.33)
    } else if (t < 0.72) {
      color = cPrim.clone().lerp(cMid, (t - 0.33) / 0.39)
    } else {
      color = cMid.clone().lerp(cHi, (t - 0.72) / 0.28)
    }

    for (let j = 0; j < 4; j++) {
      const vi = i * 4 + j
      const p = corners[j]
      positions[vi * 3] = p.x
      positions[vi * 3 + 1] = p.y
      positions[vi * 3 + 2] = p.z

      // Top edges (j=0,1) get a small highlight kick
      const edgeColor = j < 2 ? color.clone().lerp(cHi, 0.12) : color
      colors[vi * 3] = edgeColor.r
      colors[vi * 3 + 1] = edgeColor.g
      colors[vi * 3 + 2] = edgeColor.b

      uvs[vi * 2] = t
      uvs[vi * 2 + 1] = j / 3
    }
  }

  // Build the 4-face tube between consecutive cross-sections
  const indices: number[] = []
  for (let i = 0; i < samples; i++) {
    const ni = (i + 1) % samples
    const a0 = i * 4, a1 = i * 4 + 1, a2 = i * 4 + 2, a3 = i * 4 + 3
    const b0 = ni * 4, b1 = ni * 4 + 1, b2 = ni * 4 + 2, b3 = ni * 4 + 3

    // Top
    indices.push(a0, a1, b1, a0, b1, b0)
    // Right
    indices.push(a1, a2, b2, a1, b2, b1)
    // Bottom
    indices.push(a2, a3, b3, a2, b3, b2)
    // Left
    indices.push(a3, a0, b0, a3, b0, b3)
  }

  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geom.setIndex(indices)
  geom.computeVertexNormals()
  return geom
}

function RibbonMesh({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)

  const curve = useMemo(() => buildInfinityCurve(360, 1.7, 0.42), [])
  const geometry = useMemo(
    () => buildRibbonGeometry(curve, 520, 0.36, 0.07, 1.5),
    [curve]
  )

  useFrame((state, delta) => {
    if (!groupRef.current) return
    // Slow cinematic rotation — shimmer happens from env reflections, not spin
    groupRef.current.rotation.y += delta * 0.16
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.12

    // Gentle mouse-driven parallax
    const { x, y } = state.pointer
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      x * 0.12,
      0.04
    )
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      y * 0.18,
      0.04
    )
  })

  return (
    <group ref={groupRef} scale={1.08}>
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          vertexColors
          metalness={1.0}
          roughness={0.18}
          clearcoat={1.0}
          clearcoatRoughness={0.12}
          envMapIntensity={isDark ? 1.35 : 1.05}
          iridescence={0.15}
          iridescenceIOR={1.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export default function HeroInfinity3D() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  return (
    <div className="hero-canvas">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 46 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: isDark ? 1.18 : 0.95,
        }}
        style={{ background: 'transparent' }}
      >
        {/* Procedural env map — 3 colored area lights create chrome reflections
            without needing to load an HDR file. */}
        <Environment resolution={256} frames={1}>
          {/* Cool key — top-left, large */}
          <Lightformer
            form="rect"
            intensity={isDark ? 4.5 : 3.2}
            color="#b8d0ff"
            position={[-4, 4, 3]}
            scale={[6, 6, 1]}
            rotation={[0, 0.3, 0]}
          />
          {/* Warm rim — back right, punchy orange */}
          <Lightformer
            form="rect"
            intensity={isDark ? 3.5 : 2.0}
            color="#FF6A20"
            position={[4, -1, -3]}
            scale={[4, 3, 1]}
          />
          {/* Brand blue — left side, wider */}
          <Lightformer
            form="rect"
            intensity={isDark ? 2.8 : 1.8}
            color="#2855a0"
            position={[-3, -2, 2]}
            scale={[5, 4, 1]}
          />
          {/* Soft fill */}
          <Lightformer
            form="ring"
            intensity={isDark ? 1.2 : 0.8}
            color="#ffffff"
            position={[0, 3, -4]}
            scale={[3, 3, 1]}
          />
        </Environment>

        {/* Direct lighting — adds definition beyond env reflections */}
        <ambientLight intensity={isDark ? 0.12 : 0.3} />
        <directionalLight
          position={[-4, 4, 5]}
          intensity={isDark ? 0.6 : 0.9}
          color="#c8dcff"
        />
        <directionalLight
          position={[-2.5, -2, -4]}
          intensity={isDark ? 1.0 : 0.55}
          color="#FF4D00"
        />

        <RibbonMesh isDark={isDark} />
      </Canvas>

      {/* Radial fade — blends the 3D into the column bg */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 75% 72% at 50% 50%, transparent 0%, transparent 55%, var(--bg) 100%)'
            : 'radial-gradient(ellipse 70% 68% at 50% 50%, transparent 0%, transparent 50%, var(--bg) 100%)',
        }}
      />
    </div>
  )
}
