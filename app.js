document.addEventListener("DOMContentLoaded", function() {
    gsap.registerPlugin(ScrollTrigger);

    const introContainer = document.querySelector("#intro-container");
    const envelopeWrapper = document.querySelector(".envelope-wrapper");
    const invitationCard = document.querySelector(".invitation-card");
    const mainContent = document.querySelector("#main-content");
    const screen = document.querySelector(".screen");
    
    let isOpening = false;

    // Thiết lập trạng thái ban đầu (nếu cần)
    // Hầu hết trạng thái ban đầu đã được xử lý bởi CSS
    gsap.set(invitationCard, { scale: 1, rotation: 0 });
    gsap.set(envelopeWrapper, { scale: 1, rotation: 15 });

    envelopeWrapper.addEventListener('click', () => {
        if (isOpening) return;
        isOpening = true;

        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(introContainer, { 
                    opacity: 0, 
                    duration: 0.5,
                    onComplete: () => introContainer.style.display = 'none' 
                });
                
                gsap.set(mainContent, { visibility: 'visible' });
                gsap.fromTo(mainContent, { opacity: 0 }, { opacity: 1, duration: 1 });
                
                initMainContentAnimations();
            }
        });

        // 1. Thiệp bay ra khỏi phong bì theo đường cong uốn lượn
        tl.to(invitationCard, {
            duration: 1.5,
            y: "-250%", // Bay lên cao hơn
            x: "-50%",  // Lệch sang trái một chút để tạo đường cong
            rotation: -15, // Xoay ngược lại
            ease: "power2.inOut"
        });

        // 2. Cùng lúc đó, phong bì trượt xuống và mờ đi
        tl.to(envelopeWrapper, {
            duration: 1.2,
            y: "+=300",
            opacity: 0,
            ease: "power2.in"
        }, "<0.3"); // Bắt đầu sau 0.3s

        // 3. Thiệp bay vào chính diện màn hình và phóng to
        tl.to(invitationCard, {
            duration: 1.2,
            // Sử dụng % và transform để căn giữa một cách linh hoạt
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
            rotation: 0,
            scale: 2.2, // Phóng to để che màn hình
            ease: "expo.inOut"
        }, "-=0.5"); // Bắt đầu sớm hơn một chút để chuyển động mượt mà

        // 4. Thiệp mờ đi để lộ nội dung chính
        tl.to(invitationCard, {
            duration: 0.7,
            opacity: 0,
        }, "-=0.5"); // Bắt đầu khi thiệp gần phóng to xong
    });

    // Hàm để khởi tạo các animation cuộn trang của nội dung chính
    function initMainContentAnimations() {
        ScrollTrigger.defaults({ scroller: screen });

        gsap.utils.toArray(".animate-title").forEach(title => {
            gsap.from(title, {
                opacity: 0, y: 50, duration: 1,
                scrollTrigger: { trigger: title, start: "top 90%", toggleActions: "play none none none" }
            });
        });

        gsap.utils.toArray(".animate-text").forEach(text => {
            gsap.from(text, {
                opacity: 0, y: 30, duration: 1, delay: 0.2,
                scrollTrigger: { trigger: text, start: "top 90%", toggleActions: "play none none none" }
            });
        });
    }
});