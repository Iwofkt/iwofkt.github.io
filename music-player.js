// music-player.js
document.addEventListener('DOMContentLoaded', function() {
    // Music player state
    let currentTrackIndex = 0;
    let isPlaying = false;
    let audio = new Audio();
    let tracks = [];
    let likedTracks = JSON.parse(localStorage.getItem('likedTracks')) || [];
    
    // DOM elements
    const playButton = document.getElementById('play-button');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const volumeButton = document.getElementById('volume-button');
    const volumeSlider = document.getElementById('volume-slider');
    const likeButton = document.getElementById('like-button');
    const progressBar = document.getElementById('progress-bar');
    const progressBarContainer = document.getElementById('progress-bar-container');
    const currentTimeElement = document.getElementById('current-time');
    const totalTimeElement = document.getElementById('total-time');
    const currentSongTitle = document.getElementById('current-song-title');
    const currentSongArtist = document.getElementById('current-song-artist');
    const albumArt = document.getElementById('album-art');
    const albumArtIcon = document.getElementById('album-art-icon');
    const tracksContainer = document.getElementById('tracks-container');
    
    // Load tracks from the music folder
    async function loadTracks() {
        try {
            // In a real implementation, you would fetch this from a server API
            // For this example, we'll use a simulated list of tracks
            tracks = [
                {
                    title: "Falla samman",
                    artist: "Spacebird",
                    year: "2025",
                    file: "music/Falla_samman.m4a",
                    duration: "1:53",
                    cover: "assets/cosmic-flight-cover.jpg"
                },
                {
                    title: "Dancing ",
                    artist: "Spacebird",
                    year: "2025",
                    file: "music/Dancing.m4a",
                    duration: "2:44",
                    cover: "assets/cosmic-flight-cover.jpg"
                }
            ];
            
            // Populate tracks in the UI
            renderTracks();
            
            // Set the first track as current
            if (tracks.length > 0) {
                setCurrentTrack(0);
            }
        } catch (error) {
            console.error('Error loading tracks:', error);
        }
    }
    
    // Render tracks in the tracks container
    function renderTracks() {
        tracksContainer.innerHTML = '';
        
        tracks.forEach((track, index) => {
            const trackElement = document.createElement('div');
            trackElement.className = `content-card rounded-xl p-4 hover:bg-gray-700/50 transition-all duration-300 transform hover:-translate-y-1 ${index === currentTrackIndex && isPlaying ? 'track-playing' : ''}`;
            trackElement.innerHTML = `
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 ${getTrackColor(index)} rounded-lg flex items-center justify-center mr-4 cursor-pointer play-track-button" data-index="${index}">
                        <i class="fas ${index === currentTrackIndex && isPlaying ? 'fa-pause' : 'fa-play'} text-white"></i>
                    </div>
                    <div>
                        <h4 class="font-bold">${track.title}</h4>
                        <p class="text-sm text-gray-400">${track.artist} • ${track.year}</p>
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-indigo-300">${track.duration}</span>
                    <button class="like-track-button text-${isTrackLiked(index) ? 'red-500' : 'gray-400'} hover:text-white" data-index="${index}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            `;
            
            tracksContainer.appendChild(trackElement);
        });
        
        // Add event listeners to track play buttons
        document.querySelectorAll('.play-track-button').forEach(button => {
            button.addEventListener('click', function() {
                const trackIndex = parseInt(this.getAttribute('data-index'));
                if (trackIndex === currentTrackIndex) {
                    togglePlayPause();
                } else {
                    setCurrentTrack(trackIndex);
                    playTrack();
                }
            });
        });
        
        // Add event listeners to like buttons
        document.querySelectorAll('.like-track-button').forEach(button => {
            button.addEventListener('click', function() {
                const trackIndex = parseInt(this.getAttribute('data-index'));
                toggleLikeTrack(trackIndex);
            });
        });
    }
    
    // Set the current track
    function setCurrentTrack(index) {
        currentTrackIndex = index;
        const track = tracks[index];
        
        // Update audio source
        audio.src = track.file;
        
        // Update player UI
        currentSongTitle.textContent = track.title;
        currentSongArtist.textContent = `${track.artist} • ${track.year}`;
        totalTimeElement.textContent = track.duration;
        
        // Update album art
        if (track.cover) {
            albumArt.src = track.cover;
            albumArt.classList.remove('hidden');
            albumArtIcon.classList.add('hidden');
        } else {
            albumArt.classList.add('hidden');
            albumArtIcon.classList.remove('hidden');
        }
        
        // Update like button
        updateLikeButton();
        
        // Update tracks display
        renderTracks();
        
        // Reset progress bar
        progressBar.style.width = '0%';
        currentTimeElement.textContent = '0:00';
    }
    
    // Play the current track
    function playTrack() {
        audio.play();
        isPlaying = true;
        updatePlayButton();
        renderTracks();
    }
    
    // Pause the current track
    function pauseTrack() {
        audio.pause();
        isPlaying = false;
        updatePlayButton();
        renderTracks();
    }
    
    // Toggle play/pause
    function togglePlayPause() {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    }
    
    // Play next track
    function playNextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        setCurrentTrack(currentTrackIndex);
        playTrack();
    }
    
    // Play previous track
    function playPreviousTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        setCurrentTrack(currentTrackIndex);
        playTrack();
    }
    
    // Update play button icon
    function updatePlayButton() {
        const playIcon = playButton.querySelector('i');
        if (isPlaying) {
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
        } else {
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
        }
    }
    
    // Update like button
    function updateLikeButton() {
        const likeIcon = likeButton.querySelector('i');
        if (isTrackLiked(currentTrackIndex)) {
            likeIcon.classList.remove('text-indigo-300');
            likeIcon.classList.add('text-red-500');
        } else {
            likeIcon.classList.remove('text-red-500');
            likeIcon.classList.add('text-indigo-300');
        }
    }
    
    // Check if track is liked
    function isTrackLiked(index) {
        return likedTracks.includes(index);
    }
    
    // Toggle like for a track
    function toggleLikeTrack(index) {
        if (isTrackLiked(index)) {
            likedTracks = likedTracks.filter(i => i !== index);
        } else {
            likedTracks.push(index);
        }
        
        // Save to localStorage
        localStorage.setItem('likedTracks', JSON.stringify(likedTracks));
        
        // Update UI
        updateLikeButton();
        renderTracks();
    }
    
    // Get track color based on index
    function getTrackColor(index) {
        const colors = ['bg-indigo-600', 'bg-purple-600', 'bg-pink-600', 'bg-blue-600'];
        return colors[index % colors.length];
    }
    
    // Format time from seconds to MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // Event listeners
    playButton.addEventListener('click', togglePlayPause);
    prevButton.addEventListener('click', playPreviousTrack);
    nextButton.addEventListener('click', playNextTrack);
    
    volumeButton.addEventListener('click', function() {
        if (audio.volume > 0) {
            audio.volume = 0;
            volumeButton.querySelector('i').classList.remove('fa-volume-up');
            volumeButton.querySelector('i').classList.add('fa-volume-mute');
        } else {
            audio.volume = volumeSlider.value / 100;
            volumeButton.querySelector('i').classList.remove('fa-volume-mute');
            volumeButton.querySelector('i').classList.add('fa-volume-up');
        }
    });
    
    volumeSlider.addEventListener('input', function() {
        audio.volume = this.value / 100;
        if (audio.volume > 0) {
            volumeButton.querySelector('i').classList.remove('fa-volume-mute');
            volumeButton.querySelector('i').classList.add('fa-volume-up');
        }
    });
    
    likeButton.addEventListener('click', function() {
        toggleLikeTrack(currentTrackIndex);
    });
    
    // Progress bar click to seek
    progressBarContainer.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    });
    
    // Audio event listeners
    audio.addEventListener('loadedmetadata', function() {
        totalTimeElement.textContent = formatTime(audio.duration);
    });
    
    audio.addEventListener('timeupdate', function() {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percent + '%';
        currentTimeElement.textContent = formatTime(audio.currentTime);
    });
    
    audio.addEventListener('ended', playNextTrack);
    
    // Initialize the player
    loadTracks();

    // Add this line to the very end of your music-player.js file
    window.musicPlayer = { audio: audio };
});

