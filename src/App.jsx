import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, Filter, Grid3X3, Maximize2, Camera, Heart, Share2, Download } from 'lucide-react'

// SafeIcon component for dynamic icon rendering
const SafeIcon = ({ name, size = 24, className = '', color }) => {
  const icons = {
    X, ChevronLeft, ChevronRight, ZoomIn, Filter, Grid3X3, Maximize2, Camera, Heart, Share2, Download
  }
  const IconComponent = icons[name] || Camera
  return <IconComponent size={size} className={className} color={color} />
}

// Gallery data with user provided images
const galleryData = [
  {
    id: 1,
    src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-1.jpg?',
    title: 'Момент вдохновения',
    category: 'портрет',
    description: 'Красота в простоте момента',
    likes: 128
  },
  {
    id: 2,
    src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-1.jpg?',
    title: 'Гармония цвета',
    category: 'пейзаж',
    description: 'Природная палитра оттенков',
    likes: 256
  },
  {
    id: 3,
    src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-1.jpg?',
    title: 'Свет и тень',
    category: 'архитектура',
    description: 'Игра контрастов в городе',
    likes: 189
  }
]

const categories = ['все', 'портрет', 'пейзаж', 'архитектура']

// Utility for class merging
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ')
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('все')
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [likedImages, setLikedImages] = useState(new Set())

  // Filter images by category
  const filteredImages = selectedCategory === 'все'
    ? galleryData
    : galleryData.filter(img => img.category === selectedCategory)

  // Handle image loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!selectedImage) return

    if (e.key === 'Escape') {
      closeModal()
    } else if (e.key === 'ArrowLeft') {
      navigateImage('prev')
    } else if (e.key === 'ArrowRight') {
      navigateImage('next')
    }
  }, [selectedImage, currentIndex])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Open modal with image
  const openModal = (image, index) => {
    setSelectedImage(image)
    setCurrentIndex(index)
    document.body.style.overflow = 'hidden'
  }

  // Close modal
  const closeModal = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'auto'
  }

  // Navigate images in modal
  const navigateImage = (direction) => {
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % filteredImages.length
      : (currentIndex - 1 + filteredImages.length) % filteredImages.length

    setCurrentIndex(newIndex)
    setSelectedImage(filteredImages[newIndex])
  }

  // Toggle like
  const toggleLike = (e, id) => {
    e.stopPropagation()
    setLikedImages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  }

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  }

  const imageVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <SafeIcon name="Camera" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Фотогалерея</h1>
                <p className="text-xs text-slate-400 hidden sm:block">Коллекция лучших работ</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-sm text-slate-400 hidden md:block">
                {galleryData.length} работ
              </span>
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors md:hidden">
                <SafeIcon name="Grid3X3" size={20} className="text-slate-300" />
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
              Галерея <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">впечатлений</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Погрузитесь в мир визуальной красоты. Каждая фотография — это история,
              застывшая во времени.
            </p>
          </motion.section>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-10 md:mb-12"
          >
            <div className="flex items-center gap-2 mr-4 text-slate-400">
              <SafeIcon name="Filter" size={18} />
              <span className="text-sm font-medium hidden sm:block">Фильтр:</span>
            </div>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  "min-h-[44px] flex items-center",
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700/50"
                )}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </motion.div>

          {/* Gallery Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/3] bg-slate-800/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    variants={itemVariants}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -8 }}
                    onClick={() => openModal(image, index)}
                    className="group relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer bg-slate-800"
                  >
                    {/* Image */}
                    <img
                      src={image.src}
                      alt={image.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                      <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full w-fit mb-2 backdrop-blur-sm border border-blue-500/20">
                        {image.category}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                        {image.title}
                      </h3>
                      <p className="text-sm text-slate-300 line-clamp-2">
                        {image.description}
                      </p>
                    </div>

                    {/* Top Actions */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => toggleLike(e, image.id)}
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center transition-all backdrop-blur-md",
                          likedImages.has(image.id)
                            ? "bg-red-500 text-white"
                            : "bg-slate-950/50 text-white hover:bg-slate-950/80"
                        )}
                      >
                        <SafeIcon
                          name="Heart"
                          size={18}
                          className={likedImages.has(image.id) ? "fill-current" : ""}
                        />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-slate-950/50 text-white flex items-center justify-center hover:bg-slate-950/80 transition-all backdrop-blur-md">
                        <SafeIcon name="Maximize2" size={18} />
                      </button>
                    </div>

                    {/* Likes Counter */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/50 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <SafeIcon name="Heart" size={14} className="text-red-400" />
                      <span className="text-xs font-medium text-white">
                        {image.likes + (likedImages.has(image.id) ? 1 : 0)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && filteredImages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon name="Grid3X3" size={32} className="text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Нет изображений</h3>
              <p className="text-slate-400">В этой категории пока нет работ</p>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <SafeIcon name="Camera" size={16} className="text-white" />
              </div>
              <span className="text-slate-300 font-medium">Фотогалерея</span>
            </div>
            <p className="text-sm text-slate-500 text-center">
              © 2024 Фотогалерея. Все права защищены.
            </p>
            <div className="flex items-center gap-4">
              <button className="text-slate-400 hover:text-white transition-colors">
                <SafeIcon name="Share2" size={20} />
              </button>
              <button className="text-slate-400 hover:text-white transition-colors">
                <SafeIcon name="Heart" size={20} />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal/Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-slate-800/50 hover:bg-slate-700 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-md border border-slate-700/50"
            >
              <SafeIcon name="X" size={24} />
            </button>

            {/* Navigation Buttons */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-slate-800/50 hover:bg-slate-700 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-md border border-slate-700/50"
                >
                  <SafeIcon name="ChevronLeft" size={24} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-slate-800/50 hover:bg-slate-700 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-md border border-slate-700/50"
                >
                  <SafeIcon name="ChevronRight" size={24} />
                </button>
              </>
            )}

            {/* Image Container */}
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
                />
              </div>

              {/* Image Info */}
              <div className="mt-6 text-center max-w-2xl">
                <span className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full mb-3 backdrop-blur-sm border border-blue-500/20">
                  {selectedImage.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {selectedImage.title}
                </h3>
                <p className="text-slate-400 mb-4">
                  {selectedImage.description}
                </p>
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={(e) => toggleLike(e, selectedImage.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                      likedImages.has(selectedImage.id)
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                    )}
                  >
                    <SafeIcon
                      name="Heart"
                      size={18}
                      className={likedImages.has(selectedImage.id) ? "fill-current" : ""}
                    />
                    <span className="font-medium">
                      {selectedImage.likes + (likedImages.has(selectedImage.id) ? 1 : 0)}
                    </span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all border border-slate-700">
                    <SafeIcon name="Download" size={18} />
                    <span className="font-medium">Скачать</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all border border-slate-700">
                    <SafeIcon name="Share2" size={18} />
                    <span className="font-medium">Поделиться</span>
                  </button>
                </div>
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 px-4 py-2 bg-slate-800/50 rounded-full text-sm text-slate-400 backdrop-blur-md border border-slate-700/50">
                {currentIndex + 1} / {filteredImages.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}