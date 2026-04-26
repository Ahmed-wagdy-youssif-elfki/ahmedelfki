/**
 * animations.js
 * (ملف الحركات: يتحكم في التفاعلات البصرية عند التمرير باستخدام مكتبة GSAP)
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- PRELOADER ANIMATION --- 
       (تحريك شاشة التحميل الافتتاحية عند فتح الموقع وإخفاؤها بسلاسة) */
    window.addEventListener('load', () => {
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline();
            
            // ظهور اللوجو
            tl.to('.preloader .logo', {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'power3.out'
            })
            // تمدد خط التحميل
            .to('.loader-line', {
                width: '100%',
                duration: 0.7,
                ease: 'power2.inOut'
            })
            // سحب شاشة التحميل للأعلى
            .to('.preloader', {
                yPercent: -100,
                duration: 0.8,
                ease: 'power4.inOut',
                delay: 0.1
            })
            // إزالة الشاشة من الذاكرة (DOM) بعد انتهاء الحركة
            .add(() => {
                const p = document.getElementById('preloader');
                if(p) p.remove();
            });
        } else {
            const p = document.getElementById('preloader');
            if(p) p.style.display = 'none';
        }
    });

    // تسجيل ملحق ScrollTrigger لتمكين الحركات المربوطة بتمرير الصفحة (السكرول)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // إعطاء حركة دخول ناعمة للهيدر عند فتح الصفحة
        gsap.from('.site-header', {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        // تجهيز كل العناصر التي تحتوي على كلاس الظهور التدريجي (fade-up) وإخفائها مبدئياً
        const fadeUps = document.querySelectorAll('[data-gsap="fade-up"]');
        fadeUps.forEach(el => el.classList.add('gsap-reveal'));

        fadeUps.forEach(el => {
            const delay = parseFloat(el.getAttribute('data-delay')) || 0;
            gsap.to(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    once: true // (تضمن أن الحركة تحدث مرة واحدة فقط ولا تنعكس عند الصعود)
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: delay,
                ease: 'power2.out',
                onComplete: () => {
                    el.classList.remove('gsap-reveal');
                    gsap.set(el, { clearProps: 'all' });
                }
            });
        });

        const fadeLefts = document.querySelectorAll('[data-gsap="fade-left"]');
        fadeLefts.forEach(el => {
            gsap.fromTo(el, 
                { x: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        once: true
                    },
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    clearProps: 'all'
                }
            );
        });

        // تفعيل حركة اختلاف المنظور (Parallax) لكروت المنتجات في قسم البانر الرئيسي للشاشات الكبيرة فقط
        if (window.innerWidth > 768) {
            gsap.to('.sport-item', {
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                },
                y: -50
            });
            
            gsap.to('.pet-item', {
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                },
                y: 50
            });
        }
    }
});
