import { RoundCuboidCollider } from "@react-three/rapier";
import { useWindowSize } from "usehooks-ts";
import {
  useRef,
  useMemo,
  memo,
  useState,
  useEffect,
  forwardRef,
  useCallback,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Environment,
  Html as HtmlImpl,
  Lightformer,
  RoundedBox,
  useGLTF,
} from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import Link from "next/link";
import Dot from "./Dot";

const shapes = ["heart", "blink", "blush", "laugh"];

function Balls(props: any) {
  const isTouchDevice = useIsTouchDevice();
  const { width } = useWindowSize();

  const emoji = useMemo(() => {
    if (props.triggerBounce > 0) {
      return (
        <Smiley
          key="emoji"
          i={12}
          which="heart"
          position={[Math.random(), 10 + Math.random() * 10, 0]}
          // position={[0,0,0]}
          size={0.25}
          isTouchDevice={isTouchDevice}
          triggerBounce={props.triggerBounce}
        />
      );
    }
  }, [isTouchDevice, props.triggerBounce]);

  const balls = useMemo(() => {
    const maxSize = 0.5; // Maximum size for the balls
    const minSize = 0.25; // Minimum size for the balls
    const scaleFactor = Math.min(1, 1000 / width); // Scale factor based on screen width

    return Array.from({ length: 12 }, (v, i) => (
      <Ball
        key={i}
        i={i}
        which={shapes[i % shapes.length]}
        position={[Math.random(), 10 + Math.random() * 10, 0]}
        size={minSize + Math.random() * (maxSize - minSize) * scaleFactor}
        isTouchDevice={isTouchDevice}
      />
    ));
  }, [isTouchDevice, width]);

  const zoom = useMemo(() => Math.min(width / 6, 200), [width]);

  return (
    <Canvas shadows orthographic camera={{ position: [0, 0, 10], zoom: zoom }}>
      <ambientLight intensity={Math.PI} />
      <spotLight decay={0} position={[5, 10, 2.5]} angle={0.2} castShadow />
      <Physics>
        {balls}
        {emoji}
        <BottomButton />
        <Walls />
        {/* <MousePane /> */}
      </Physics>
      <Environment>
        <Lightformer
          form="rect"
          intensity={4}
          position={[15, 10, 10]}
          scale={20}
          onCreated={(self) => self.lookAt(0, 0, 0)}
        />
        <Lightformer
          intensity={2}
          position={[-10, 0, -20]}
          scale={[10, 100, 1]}
          onCreated={(self) => self.lookAt(0, 0, 0)}
        />
      </Environment>
    </Canvas>
  );
}

const colors = [
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#d4064f",
  "#d406b6",
  "#d48b06",
  "#a85a32",
  "#a8323e",
  "#57de5d",
  "#036934",
  "#ff922b",
  "#c18fff",
];

export function Ball({ i, which, size, isTouchDevice, ...props }) {
  const api = useRef();
  const handleClick = () => {
    if (!api.current) return;
    api.current.applyImpulse({ x: 0, y: size * 5, z: 0 }, true);
    api.current.applyTorqueImpulse(
      {
        x: Math.random() / 2,
        y: Math.random() / 2,
        z: Math.random() / 2,
      },
      true
    );
  };

  return (
    <RigidBody
      colliders={"ball"}
      ref={api}
      enabledTranslations={[true, true, false]}
      linearDamping={1}
      angularDamping={1}
      restitution={0.5}
      {...props}
    >
      {/* <BallCollider args={[size]} /> */}
      <mesh
        castShadow
        receiveShadow
        onPointerOver={() => {
          if (!isTouchDevice) handleClick();
        }}
        onPointerDown={() => {
          if (isTouchDevice) handleClick();
        }}
      >
        <meshStandardMaterial
          color={colors[i] || "black"}
          roughness={0.2}
          toneMapped={false}
        />
        <sphereGeometry args={[size + 0.01, 32, 32]} />
      </mesh>
    </RigidBody>
  );
}

useGLTF.preload("/cowboy.glb");

function Smiley({ i, which, size, isTouchDevice, triggerBounce, ...props }) {
  const api = useRef();

  const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };
  const handleClick = useCallback(() => {
    if (!api.current) return;
    api.current.applyImpulse(
      { x: 0, y: clamp(Math.random() * 15, 5, 15), z: 0 },
      true
    );
  }, []);

  useEffect(() => {
    if (triggerBounce > 1) {
      if (!api.current) return;
      console.log("applying impulse");
      api.current.applyTorqueImpulse(
        {
          // x: Math.PI / 2,
          x: 0,
          y: Math.PI * 2,
          z: 0,
        },
        true
      );
    }
  }, [triggerBounce]);

  const { nodes, materials } = useGLTF("/cowboy.glb");

  return (
    <RigidBody
      // colliders={false}
      colliders={"hull"}
      // enabledTranslations={[true, true, false]}
      enabledTranslations={[true, true, false]}
      enabledRotations={[false, true, false]} // If any are true, the emoji will appear in front of the balls.
      ref={api}
      // position={[0, 0, 1]}
      linearDamping={1}
      angularDamping={1}
      restitution={1}
      // scale={[size, size, size]}
      rotation={[-Math.PI / 2, 0, 0]}
      // {...props}
    >
      {/* <BallCollider args={[size]} /> */}
      {/* {vertices.length > 0 && <ConvexHullCollider vertices={vertices} />} */}
      <group
        scale={0.05}
        onPointerOver={() => {
          if (!isTouchDevice) handleClick();
        }}
        onPointerDown={() => {
          if (isTouchDevice) handleClick();
        }}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_2.geometry}
          material={materials.Brown}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_3.geometry}
          material={materials.Orange_Dark_Matte}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_4.geometry}
          // material={materials.Orange_Shiny}
        >
          <meshStandardMaterial
            color={"orange"}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_5.geometry}
          material={materials.White_Matte}
        />
      </group>
    </RigidBody>
  );
}

import { useSpring, animated } from "@react-spring/three";

// https://github.com/pmndrs/drei/issues/1137#issuecomment-1307474176
import { useContextBridge } from "its-fine";

export const Html = forwardRef(function Html({ children, ...props }, ref) {
  const Bridge = useContextBridge();
  return (
    <HtmlImpl {...props} ref={ref}>
      <Bridge>{children}</Bridge>
    </HtmlImpl>
  );
});

const AnimatedRoundedBox = animated(RoundedBox);

function BottomButton() {
  const { width, height } = useThree((state) => state.viewport);

  const ROUNDED_AMT = 0.1;

  // Create a useFrame to increase the size of the button on hover
  const [hovered, setHovered] = useState(false);
  const springs = useSpring({ scale: hovered ? 1.05 : 1 });

  return (
    <group
    // onPointerOver={() => setHovered(true)}
    // onPointerOut={() => setHovered(false)}
    >
      <RigidBody
        colliders={false}
        position={[0, -height / 2 + height * 0.07, 0]}
        enabledRotations={[false, false, false]}
        enabledTranslations={[false, false, false]}
      >
        <RoundCuboidCollider
          args={[
            width / 4 - ROUNDED_AMT,
            height * 0.035 - ROUNDED_AMT,
            1,
            ROUNDED_AMT,
          ]}
        />
        <AnimatedRoundedBox
          args={[width / 2, height * 0.07, 1]}
          radius={ROUNDED_AMT}
          scale={springs.scale}
        >
          <meshStandardMaterial
            color={"black"}
            roughness={0.2}
            toneMapped={false}
          />

          {/* FIXME: Click targets are not exact... */}
          <Html center>
            <Link
              scroll={false}
              href="/projects"
              className="cursor-pointer text-lg ml-auto flex items-center gap-3 w-max text-white rounded-full transition-all px-[12vw] md:px-[16vw] lg:px-[18vw] py-[24px]"
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
            >
              Check my work
              <Dot animated={hovered} />
            </Link>
          </Html>
        </AnimatedRoundedBox>
      </RigidBody>
    </group>
  );
}

function MousePane() {
  const ref = useRef();
  const { width, height } = useThree((state) => state.viewport);
  // const paneWidth = width * 0.5;
  const paneWidth = 1;
  // const { mouse } = useThree();

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      ref.current.setTranslation({
        x: x * (width / 2),
        y: y * (height / 2),
        z: 0,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [width, height]);

  return (
    <RigidBody ref={ref} type="fixed">
      <CuboidCollider args={[paneWidth, 0.1, 10]} />
      <mesh castShadow receiveShadow>
        <meshStandardMaterial
          color={"black"}
          roughness={0.2}
          toneMapped={false}
        />
        <boxGeometry args={[paneWidth, 0.1, 10]} />
      </mesh>
    </RigidBody>
  );
}

function Walls() {
  const { width, height } = useThree((state) => state.viewport);
  return (
    <>
      <CuboidCollider
        position={[0, -height / 2 - 1, 0]}
        args={[width / 2, 1, 10]} // Increased Z dimension to ensure depth coverage
      />
      <CuboidCollider
        position={[-width / 2 - 1, 0, 0]}
        args={[1, height * 10, 10]}
      />
      <CuboidCollider
        position={[width / 2 + 1, 0, 0]}
        args={[1, height * 10, 1]}
      />
    </>
  );
}

export default memo(Balls);
