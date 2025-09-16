document.addEventListener("DOMContentLoaded", function() {
    gsap.registerPlugin(ScrollTrigger);

    // Lấy các phần tử DOM
    const introContainer = document.querySelector("#intro-container");
    const envelopeWrapper = document.querySelector(".envelope-wrapper");
    const invitationCard = document.querySelector(".invitation-card");
    const mainContent = document.querySelector("#main-content");
    const screen = document.querySelector(".screen");
    const backgroundMusic = document.getElementById("background-music");
    
    // Lấy các phần tử điều khiển âm thanh
    const volumeControl = document.getElementById("volume-control");
    const iconUnmuted = document.getElementById("icon-unmuted");
    const iconMuted = document.getElementById("icon-muted");
    
    let isOpening = false;

    gsap.set(invitationCard, { scale: 1, rotation: 0 });
    gsap.set(envelopeWrapper, { scale: 1, rotation: 15 });

    // Timeline chính cho animation mở thiệp
    const tl = gsap.timeline({
        paused: true, // Tạm dừng ban đầu
        onComplete: () => {
            gsap.to(introContainer, { 
                opacity: 0, 
                duration: 0.5,
                onComplete: () => introContainer.style.display = 'none' 
            });
            
            gsap.set(mainContent, { visibility: 'visible' });
            gsap.fromTo(mainContent, { opacity: 0 }, { opacity: 1, duration: 1 });
            
            gsap.to(volumeControl, { opacity: 1, visibility: 'visible', duration: 0.5 });

            initMainContentAnimations();

            // SAU KHI MỌI THỨ HOÀN TẤT, BẮT ĐẦU HIỂN THỊ LỜI CHÚC
            initWishStream();
        }
    });

    // Xây dựng animation
    tl.to(invitationCard, {
        duration: 1.5,
        y: "-250%",
        x: "-50%",
        rotation: -15,
        ease: "power2.inOut"
    }).to(envelopeWrapper, {
        duration: 1.2,
        y: "+=300",
        opacity: 0,
        ease: "power2.in"
    }, "<0.3").to(invitationCard, {
        duration: 1.2,
        top: "50%",
        left: "50%",
        x: "-50%",
        y: "-50%",
        rotation: 0,
        scale: 2.2,
        ease: "expo.inOut"
    }, "-=0.5").to(invitationCard, {
        duration: 0.7,
        opacity: 0,
    }, "-=0.5");


    // Sự kiện click vào phong bì
    envelopeWrapper.addEventListener('click', () => {
        if (isOpening) return;
        isOpening = true;

        if (backgroundMusic.paused) {
            backgroundMusic.currentTime = 39;
            backgroundMusic.volume = 0;
            backgroundMusic.play().catch(e => console.error("Lỗi phát nhạc:", e));
            gsap.to(backgroundMusic, { volume: 0.3, duration: 5 });
        }
        
        // Chạy animation
        tl.play();
    });

    // Sự kiện click vào nút điều khiển âm thanh
    volumeControl.addEventListener('click', () => {
        backgroundMusic.muted = !backgroundMusic.muted;

        if (backgroundMusic.muted) {
            iconUnmuted.style.display = 'none';
            iconMuted.style.display = 'block';
        } else {
            iconUnmuted.style.display = 'block';
            iconMuted.style.display = 'none';
        }
    });

    // Hàm khởi tạo animation cuộn trang
    function initMainContentAnimations() {
        ScrollTrigger.defaults({ scroller: screen });

        gsap.utils.toArray(".animate-title").forEach(title => {
            gsap.from(title, {
                opacity: 0, y: 50, duration: 1,
                scrollTrigger: { 
                    trigger: title, 
                    start: "top 90%", 
                    toggleActions: "play reverse play reverse" 
                }
            });
        });

        gsap.utils.toArray(".animate-text").forEach(text => {
            gsap.from(text, {
                opacity: 0, y: 30, duration: 1, delay: 0.2,
                scrollTrigger: { 
                    trigger: text, 
                    start: "top 90%", 
                    toggleActions: "play reverse play reverse" 
                }
            });
        });
        
        const familySection = document.querySelector('.family');
        if (familySection) {
            gsap.set('.groom-family', { xPercent: -100, opacity: 0, visibility: 'visible' });
            gsap.set('.bride-family', { xPercent: 100, opacity: 0, visibility: 'visible' });

            const familyTl = gsap.timeline({
                scrollTrigger: {
                    trigger: familySection,
                    start: 'top 80%', 
                    end: 'bottom 20%', 
                    toggleActions: 'play reverse play reverse' 
                }
            });

            familyTl.to('.groom-family', { xPercent: 0, opacity: 1, duration: 1, ease: 'power2.out' })
                    .to('.bride-family', { xPercent: 0, opacity: 1, duration: 1, ease: 'power2.out' }, '<');
        }

        // === BẮT ĐẦU ĐOẠN MÃ MỚI CHO HIỆU ỨNG ẢNH ===
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems.length > 0) {
            gsap.from(galleryItems, {
                scrollTrigger: {
                    trigger: '.gallery-grid', // Kích hoạt khi lưới ảnh vào tầm nhìn
                    start: 'top 85%',
                    toggleActions: 'play reverse play reverse'
                },
                opacity: 0,
                scale: 0.5, // Bắt đầu từ kích thước nhỏ
                duration: 0.8,
                ease: 'back.out(1.7)', // Hiệu ứng nảy ra
                stagger: 0.3 // Độ trễ giữa các ảnh
            });
        }
        // === KẾT THÚC ĐOẠN MÃ MỚI ===
    }

    // ==============================================================
    // ===== PHẦN NÚT CHỨC NĂNG VÀ FORM LỜI CHÚC =====
    // ==============================================================

    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const addWishBtn = document.getElementById('addWishBtn');
    const wishModal = document.getElementById('wishModal');
    const thankYouModal = document.getElementById('thankYouModal');
    const wishForm = document.getElementById('wishForm');
    const closeButtons = document.querySelectorAll('.close-modal');

    if (screen && scrollTopBtn) {
        screen.addEventListener('scroll', () => {
            if (screen.scrollTop > 300) {
                scrollTopBtn.style.display = 'flex';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            screen.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    addWishBtn.addEventListener('click', () => {
        wishModal.style.display = 'flex';
    });

    const closeModal = () => {
        wishModal.style.display = 'none';
        thankYouModal.style.display = 'none';
    };

    closeButtons.forEach(button => button.addEventListener('click', closeModal));
    window.addEventListener('click', (event) => {
        if (event.target === wishModal || event.target === thankYouModal) {
            closeModal();
        }
    });

    wishForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const nameInput = document.getElementById('wisherName');
        const messageInput = document.getElementById('wishMessage');
        const submitButton = wishForm.querySelector('.submit-btn');

        const wishData = { name: nameInput.value, message: messageInput.value };
        submitButton.disabled = true;
        submitButton.textContent = 'Đang gửi...';
        
        try {
            const response = await fetch('/api/add-wish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(wishData),
            });
            if (!response.ok) throw new Error('Lỗi khi gửi lời chúc.');
            
            closeModal();
            thankYouModal.style.display = 'flex';
            wishForm.reset();
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Gửi';
        }
    });

    // ==============================================================
    // ===== LOGIC HIỂN THỊ DÒNG LỜI CHÚC (ĐÃ CẬP NHẬT) =====
    // ==============================================================
    
    function initWishStream() {
        const wishStreamContainer = document.getElementById('wish-stream-container');
        let allWishes = [];

        async function fetchWishes() {
            try {
                const response = await fetch('/api/get-wishes');
                if (!response.ok) return;
                allWishes = await response.json();
            } catch (error) {
                console.error("Không thể tải lời chúc:", error);
            }
        }

        function showRandomWish() {
            if (allWishes.length === 0 || !wishStreamContainer) return;

            const randomWish = allWishes[Math.floor(Math.random() * allWishes.length)];
            const card = document.createElement('div');
            card.className = 'wish-card';
            card.innerHTML = `<p><span class="wisher-name">${randomWish.name}:</span>${randomWish.message}</p>`;
            
            // Đặt vị trí Y ngẫu nhiên, đảm bảo không trùng lặp quá nhiều
            const randomTop = Math.random() * 70 + 15;
            card.style.top = `${randomTop}%`;
            wishStreamContainer.appendChild(card);

            const randomDuration = Math.random() * 10 + 15; // Tốc độ chạy ngẫu nhiên
            gsap.to(card, {
                x: `-${wishStreamContainer.offsetWidth + card.offsetWidth + 20}px`,
                duration: randomDuration,
                ease: 'none',
                onComplete: () => card.remove() // Xóa thẻ khỏi DOM khi chạy xong
            });
        }

        // *** BẮT ĐẦU THAY ĐỔI ***
        // Hàm mới để hiển thị một đợt gồm nhiều lời chúc
        function showWishBatch() {
            if (allWishes.length === 0) return;

            // Số lượng lời chúc trong đợt này (ngẫu nhiên 2 hoặc 3)
            const batchSize = Math.floor(Math.random() * 2) + 2; 

            for (let i = 0; i < batchSize; i++) {
                // Thêm một độ trễ nhỏ cho mỗi lời chúc để chúng không xuất hiện cùng lúc
                // và không bị xếp chồng lên nhau
                setTimeout(() => {
                    showRandomWish();
                }, i * 800); // Ví dụ: lời chúc thứ 2 xuất hiện sau 800ms, thứ 3 sau 1600ms
            }
        }
        // *** KẾT THÚC THAY ĐỔI ***


        fetchWishes().then(() => {
            if (allWishes.length > 0) {
                // Hiển thị đợt đầu tiên ngay lập tức
                showWishBatch();
                
                // Lặp lại việc hiển thị mỗi đợt sau 4-5 giây
                setInterval(showWishBatch, 4000 + Math.random() * 1000); 
            }
        });
    }
});