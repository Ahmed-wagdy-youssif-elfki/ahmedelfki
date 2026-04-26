/**
 * main.js
 * Handles core interactions like sticky header, mobile menu, and product rendering.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- STICKY HEADER --- 
       (شريط التنقل الثابت: هذا الجزء يراقب التمرير، وعند النزول للأسفل يضيف كلاس لجعل الهيدر ثابتاً وملوناً) */
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* --- MOBILE MENU --- 
       (قائمة الجوال: للتحكم بظهور وإخفاء القائمة الجانبية في الشاشات الصغيرة عند الضغط على زر الهامبرجر) */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const headerEl = document.querySelector('.site-header'); // using parent container for nav-active class

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            headerEl.classList.toggle('nav-active');
            const icon = mobileToggle.querySelector('i');
            if (headerEl.classList.contains('nav-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    /* --- COUNTDOWN TIMER (Flash Sale) --- 
       (مؤقت العروض: يحسب الوقت المتبقي بناء على توقيت وهمي (يومان و14 ساعة) لتحديث العداد في الصفحة الرئيسية) */
    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMins = document.getElementById('cd-mins');
    const cdSecs = document.getElementById('cd-secs');

    if (cdDays) {
        // Set target date to exactly 2 days, 14 hours ahead for demo purposes
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 2);
        targetDate.setHours(targetDate.getHours() + 14);

        const updateCD = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(updateCD);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            cdDays.innerText = days < 10 ? '0' + days : days;
            cdHours.innerText = hours < 10 ? '0' + hours : hours;
            cdMins.innerText = minutes < 10 ? '0' + minutes : minutes;
            cdSecs.innerText = seconds < 10 ? '0' + seconds : seconds;
        }, 1000);
    }

    /* --- TABS FILTERING (Static HTML) --- 
       (نظام فلترة التابات: يتحكم في عرض وإخفاء المنتجات داخل الجريد بناء على الفئة (مستلزمات رياضية / حيوانات) بدون التعديل على الدوم) */
    const tabs = document.querySelectorAll('.tab-btn');
    const allProducts = document.querySelectorAll('#featured-products .product-card');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            const targetFilter = e.target.getAttribute('data-target');
            
            allProducts.forEach(card => {
                if (targetFilter === 'all' || card.getAttribute('data-category') === targetFilter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        });
    });

    // Handle generic category filtering if initiated from URL
    window.renderProducts = function(filter) {
        tabs.forEach(t => {
            if (t.getAttribute('data-target') === filter) {
                t.click();
            }
        });
    };

    /* --- FAQ ACCORDION --- 
       (كود تشغيل قسم الأسئلة الشائعة بفتح وإغلاق الإجابات وتدوير السهم) */
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.nextElementSibling;
            const isActive = btn.classList.contains('active');
            
            // إغلاق كل الأسئلة الأخرى لإبقاء الشاشة نظيفة
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.style.maxHeight = null;
            });

            // إذا كان السؤال الحالي غير فعال، قم بفتحه
            if (!isActive) {
                btn.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
});
