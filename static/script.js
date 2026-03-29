gsap.registerPlugin(ScrollTrigger);
lucide.createIcons();

document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(follower, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.3 });
    });

    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        });
    });

    gsap.to('#progress-bar', { scaleX: 1, scrollTrigger: { scrub: 0.3 } });

    // Hero Entrance
    const tl = gsap.timeline();
    tl.to('.reveal-up', { opacity: 1, y: 0, duration: 1, stagger: 0.2 })
      .to('.reveal-up-large', { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" }, "-=0.5")
      .to('#hero-line', { scaleX: 1, duration: 1.5, ease: "expo.inOut" }, "-=1");

    // Skill Animations
    gsap.utils.toArray('.skill-item').forEach(item => {
        const bar = item.querySelector('.skill-bar');
        const percent = item.querySelector('.skill-percent');
        const target = percent.getAttribute('data-target');

        gsap.to(bar, {
            scrollTrigger: { trigger: item, start: "top 90%" },
            width: item.querySelector('.skill-bar').getAttribute('data-width'),
            duration: 1.5,
            ease: "power2.out"
        });

        let count = { val: 0 };
        gsap.to(count, {
            scrollTrigger: { trigger: item, start: "top 90%" },
            val: target,
            duration: 1.5,
            onUpdate: () => { percent.innerText = Math.floor(count.val) + "%"; }
        });
    });

    // Sliding Reveals
    gsap.utils.toArray('.reveal-left').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: "top 85%" },
            x: -100, opacity: 0, duration: 1.2, ease: "power3.out"
        });
    });

    gsap.utils.toArray('.reveal-right').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: "top 85%" },
            x: 100, opacity: 0, duration: 1.2, ease: "power3.out"
        });
    });

    gsap.utils.toArray('.reveal-up').forEach(el => {
        gsap.to(el, {
            scrollTrigger: { trigger: el, start: "top 85%" },
            opacity: 1, y: 0, duration: 1, ease: "power3.out"
        });
    });

    // Message Board Logic
    const fetchMessages = async () => {
        const res = await fetch('/api/messages');
        const data = await res.json();
        document.getElementById('message-board').innerHTML = data.map(msg => `
            <div class="p-8 bg-white/5 border border-white/10 rounded-2xl mb-4 backdrop-blur-sm hover:border-wine/50 transition-colors">
                <h4 class="text-2xl font-display font-bold italic text-wine mb-2">${msg.name}</h4>
                <p class="text-lg text-white/60">${msg.message}</p>
            </div>
        `).join('') || '<p class="text-white/20 font-mono text-xs italic">No entries yet.</p>';
    };
    fetchMessages();

    document.getElementById('contact-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        const res = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            e.target.reset();
            fetchMessages();
            const popup = document.getElementById('success-popup');
            gsap.to(popup, { opacity: 1, y: 0, duration: 0.5 });
            setTimeout(() => gsap.to(popup, { opacity: 0, y: 10, duration: 0.5 }), 4000);
        }
    });
});