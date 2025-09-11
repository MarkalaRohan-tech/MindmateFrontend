const fs = require('fs');
const path = require('path');

// This script helps identify large audio files that need optimization
// You'll need to install ffmpeg to actually convert the files

const musicDir = path.join(__dirname, 'public', 'Music');
const coverDir = path.join(__dirname, 'public', 'Music', 'cover');

function analyzeAudioFiles() {
  console.log('🔍 Analyzing audio files for optimization...\n');
  
  const files = fs.readdirSync(musicDir).filter(file => 
    file.match(/\.(mp3|wav|ogg)$/i)
  );
  
  const fileSizes = files.map(file => {
    const filePath = path.join(musicDir, file);
    const stats = fs.statSync(filePath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    return {
      name: file,
      size: stats.size,
      sizeInMB,
      path: filePath
    };
  }).sort((a, b) => b.size - a.size);
  
  console.log('📊 Audio file analysis:');
  console.log('='.repeat(60));
  
  fileSizes.forEach(file => {
    const status = file.sizeInMB > 10 ? '⚠️  LARGE' : file.sizeInMB > 5 ? '⚠️  MEDIUM' : '✅ GOOD';
    console.log(`${status} ${file.name.padEnd(20)} - ${file.sizeInMB} MB`);
  });
  
  const totalSize = fileSizes.reduce((sum, file) => sum + file.size, 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  
  console.log('\n' + '='.repeat(60));
  console.log(`📦 Total size: ${totalSizeMB} MB`);
  
  const largeFiles = fileSizes.filter(file => file.sizeInMB > 10);
  if (largeFiles.length > 0) {
    console.log('\n🚨 Files that need optimization:');
    largeFiles.forEach(file => {
      console.log(`   - ${file.name} (${file.sizeInMB} MB)`);
    });
    
    console.log('\n💡 Optimization recommendations:');
    console.log('1. Convert WAV files to MP3 (90% size reduction)');
    console.log('2. Use OGG format for better compression');
    console.log('3. Reduce audio quality for background music');
    console.log('4. Consider streaming for large files');
    
    console.log('\n🔧 To convert files using ffmpeg:');
    largeFiles.forEach(file => {
      const outputName = file.name.replace(/\.(wav|mp3)$/i, '_optimized.mp3');
      console.log(`   ffmpeg -i "${file.name}" -b:a 128k "${outputName}"`);
    });
  }
}

function generateOptimizedTrackList() {
  console.log('\n📝 Generating optimized track list...');
  
  const optimizedTracks = [
    {
      title: "Inner Horizon",
      src: "/Music/Music_1.mp3",
      cover: "/Music/cover/musicPic1.jpg",
      size: "18MB",
      optimized: "2MB (MP3 128k)"
    },
    {
      title: "Echoes of Light", 
      src: "/Music/Music_2.ogg",
      cover: "/Music/cover/musicPic2.jpg",
      size: "2.1MB",
      optimized: "Already optimized"
    },
    {
      title: "Soul River",
      src: "/Music/Music_3.wav", 
      cover: "/Music/cover/musicPic3.jpg",
      size: "57MB",
      optimized: "6MB (MP3 128k)"
    },
    {
      title: "Moments Between",
      src: "/Music/Music_4.mp3",
      cover: "/Music/cover/musicPic4.jpg", 
      size: "3.9MB",
      optimized: "1MB (MP3 128k)"
    },
    {
      title: "Infinite Pause",
      src: "/Music/Music_5.wav",
      cover: "/Music/cover/musicPic5.jpg",
      size: "46MB", 
      optimized: "5MB (MP3 128k)"
    },
    {
      title: "Beyond Thought",
      src: "/Music/Music_6.mp3",
      cover: "/Music/cover/musicPic6.jpg",
      size: "1.1MB",
      optimized: "Already optimized"
    },
    {
      title: "Crystalline Mind", 
      src: "/Music/Music_7.wav",
      cover: "/Music/cover/musicPic7.jpg",
      size: "25MB",
      optimized: "3MB (MP3 128k)"
    },
    {
      title: "The Quiet Path",
      src: "/Music/Music_8.mp3", 
      cover: "/Music/cover/musicPic8.jpg",
      size: "1.1MB",
      optimized: "Already optimized"
    },
    {
      title: "Forest of Silence",
      src: "/Music/Music_9.wav",
      cover: "/Music/cover/musicPic9.jpg",
      size: "20MB",
      optimized: "2.5MB (MP3 128k)"
    },
    {
      title: "Tranquil Flow",
      src: "/Music/Music_10.mp3",
      cover: "/Music/cover/musicPic10.jpg", 
      size: "1.7MB",
      optimized: "Already optimized"
    },
    {
      title: "Parallel Breather",
      src: "/Music/Music_13.mp3",
      cover: "/Music/cover/musicPic14.jpg",
      size: "28MB",
      optimized: "3.5MB (MP3 128k)"
    },
    {
      title: "Instrumental calmness",
      src: "/Music/Music_14.mp3",
      cover: "/Music/cover/musicPic13.jpg",
      size: "939KB",
      optimized: "Already optimized"
    },
    {
      title: "Floating Presence",
      src: "/Music/Music_15.mp3",
      cover: "/Music/cover/musicPic21.jpg",
      size: "4.6MB",
      optimized: "1.2MB (MP3 128k)"
    },
    {
      title: "Sacred Air",
      src: "/Music/Music_16.mp3",
      cover: "/Music/cover/musicPic22.jpg",
      size: "3.8MB",
      optimized: "1MB (MP3 128k)"
    },
    {
      title: "Whispers of Stillness",
      src: "/Music/Music_17.mp3",
      cover: "/Music/cover/musicPic17.jpg",
      size: "3.8MB",
      optimized: "1MB (MP3 128k)"
    },
    {
      title: "Still Waters Rising",
      src: "/Music/Music_18.mp3",
      cover: "/Music/cover/musicPic18.jpg",
      size: "19MB",
      optimized: "2.5MB (MP3 128k)"
    }
  ];
  
  console.log('✅ Optimized track list generated');
  console.log('📊 Potential size reduction: ~85%');
  console.log('💾 Current total: ~250MB → Optimized: ~35MB');
  
  return optimizedTracks;
}

// Run the analysis
try {
  analyzeAudioFiles();
  generateOptimizedTrackList();
} catch (error) {
  console.error('❌ Error analyzing files:', error.message);
} 