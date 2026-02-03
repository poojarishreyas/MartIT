import { useRef, useEffect, useState, useCallback } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const TOTAL_FRAMES = 26;
const FRAME_PATH = "/iphone_banner/ezgif-frame-";

interface ScrollCanvasProps {
  onLoadComplete?: () => void;
}

const ScrollCanvas = ({ onLoadComplete }: ScrollCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, TOTAL_FRAMES - 1]
  );

  // Preload all images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises: Promise<HTMLImageElement>[] = [];

      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.src = `${FRAME_PATH}${String(i).padStart(3, "0")}.jpg`;
          img.onload = () => {
            setLoadProgress((prev) => prev + 1);
            resolve(img);
          };
          img.onerror = reject;
        });
        imagePromises.push(promise);
      }

      try {
        const loadedImages = await Promise.all(imagePromises);
        setImages(loadedImages);
        setIsLoading(false);
        onLoadComplete?.();
      } catch (error) {
        console.error("Failed to load images:", error);
      }
    };

    loadImages();
  }, [onLoadComplete]);

  // Draw frame to canvas
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx || images.length === 0) return;

      const frameIdx = Math.min(
        Math.max(Math.round(index), 0),
        images.length - 1
      );
      const img = images[frameIdx];

      if (!img) return;

      // Set canvas size to match image aspect ratio
      const dpr = window.devicePixelRatio || 1;
      const containerWidth = canvas.clientWidth;
      const containerHeight = canvas.clientHeight;

      canvas.width = containerWidth * dpr;
      canvas.height = containerHeight * dpr;
      ctx.scale(dpr, dpr);

      // Calculate dimensions to fit image (contain)
      const imgAspect = img.width / img.height;
      const canvasAspect = containerWidth / containerHeight;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgAspect > canvasAspect) {
        drawWidth = containerWidth;
        drawHeight = containerWidth / imgAspect;
        offsetX = 0;
        offsetY = (containerHeight - drawHeight) / 2;
      } else {
        drawHeight = containerHeight;
        drawWidth = containerHeight * imgAspect;
        offsetX = (containerWidth - drawWidth) / 2;
        offsetY = 0;
      }

      // Clear and draw
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, containerWidth, containerHeight);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    },
    [images]
  );

  // Subscribe to frame changes
  useEffect(() => {
    if (images.length === 0) return;

    // Draw initial frame
    drawFrame(0);

    const unsubscribe = frameIndex.on("change", (latest) => {
      drawFrame(latest);
    });

    return () => unsubscribe();
  }, [frameIndex, images, drawFrame]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (images.length > 0) {
        drawFrame(frameIndex.get());
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [images, frameIndex, drawFrame]);

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full">
      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]">
          <div className="relative mb-6">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/10 border-t-white/80" />
          </div>
          <p className="text-sm tracking-tight text-white/60">
            Loading Experience
          </p>
          <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-white/80"
              initial={{ width: 0 }}
              animate={{ width: `${(loadProgress / TOTAL_FRAMES) * 100}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <p className="mt-2 text-xs text-white/40">
            {Math.round((loadProgress / TOTAL_FRAMES) * 100)}%
          </p>
        </div>
      )}

      {/* Sticky Canvas */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center">
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          style={{ background: "#050505" }}
        />
      </div>

      {/* Text Overlays */}
      <TextOverlays scrollYProgress={scrollYProgress} isLoading={isLoading} />
    </div>
  );
};

// Text Overlays Component
interface TextOverlaysProps {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  isLoading: boolean;
}

const TextOverlays = ({ scrollYProgress, isLoading }: TextOverlaysProps) => {
  // Hero Section (0%)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

  // Feature 1 (30%)
  const feature1Opacity = useTransform(
    scrollYProgress,
    [0.2, 0.3, 0.4, 0.5],
    [0, 1, 1, 0]
  );
  const feature1X = useTransform(
    scrollYProgress,
    [0.2, 0.3, 0.4, 0.5],
    [-50, 0, 0, -50]
  );

  // Feature 2 (60%)
  const feature2Opacity = useTransform(
    scrollYProgress,
    [0.5, 0.6, 0.7, 0.8],
    [0, 1, 1, 0]
  );
  const feature2X = useTransform(
    scrollYProgress,
    [0.5, 0.6, 0.7, 0.8],
    [50, 0, 0, 50]
  );

  // CTA (90%)
  const ctaOpacity = useTransform(scrollYProgress, [0.8, 0.9, 1], [0, 1, 1]);
  const ctaY = useTransform(scrollYProgress, [0.8, 0.9], [50, 0]);
  const ctaScale = useTransform(scrollYProgress, [0.8, 0.9], [0.95, 1]);

  if (isLoading) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      {/* Hero Section */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      >

        <motion.div
          className="mt-8 flex items-center gap-2 text-black/40"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
        
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Feature 1 - Left Aligned */}
      <motion.div
        style={{ opacity: feature1Opacity, x: feature1X }}
        className="absolute left-6 top-1/2 max-w-sm -translate-y-1/2 md:left-12 lg:left-24"
      >
        <div className="space-y-4">
          <div className="inline-block rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="text-xs font-medium uppercase tracking-widest text-white/60">
              A19 Pro Chip
            </span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-black md:text-4xl lg:text-5xl">
            Fastest chip
            <br />
            ever in a smartphone.
          </h2>
          <p className="text-base leading-relaxed tracking-tight text-white/60 md:text-lg">
            The most powerful chip ever in a smartphone. With a new 6-core GPU
            that's up to 20% faster than A18 Pro.
          </p>
        </div>
      </motion.div>

      {/* Feature 2 - Right Aligned */}
      <motion.div
        style={{ opacity: feature2Opacity, x: feature2X }}
        className="absolute right-6 top-1/2 max-w-sm -translate-y-1/2 text-right md:right-12 lg:right-24"
      >
        <div className="space-y-4">
          <div className="inline-block rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="text-xs font-medium uppercase tracking-widest text-white/60">
              Pro Camera System
            </span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-black md:text-4xl lg:text-5xl">
            See the full picture.
          </h2>
          <p className="text-base leading-relaxed tracking-tight text-white/60 md:text-lg">
            48MP Fusion camera. 5x Telephoto. Ultra Wide. A new level of detail
            and color accuracy in every shot.
          </p>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        style={{ opacity: ctaOpacity, y: ctaY, scale: ctaScale }}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      >
        </motion.div>
      
        <p className="mt-4 max-w-lg text-base tracking-tight text-white/60 md:text-lg">
          Crafted with precision. Built to last. This is the future of
          smartphone technology.
        </p>
        <div className=" mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <button className="pointer-events-auto rounded-full bg-white px-8 py-3 text-sm font-medium tracking-tight text-black transition-all hover:scale-105 hover:bg-white/90">
            Buy Now
          </button>
          <button className="pointer-events-auto rounded-full border border-white/30 px-8 py-3 text-sm font-medium tracking-tight text-black transition-all hover:border-white/50 hover:bg-white/10">
            Learn More
          </button>
        </div>
      
    </div>
  );
};

export default ScrollCanvas;
