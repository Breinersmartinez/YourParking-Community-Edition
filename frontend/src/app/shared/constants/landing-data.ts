export interface NavItem { label: string; href: string; }
export interface Testimonial { user: string; company: string; image: string; text: string; }
export interface Feature { icon: string; text: string; description: string; }
export interface ChecklistItem { title: string; description: string; }
export interface FooterLink { href: string; text: string; }

export const navItems: NavItem[] = [
  { label: 'Reserva', href: '#' },
  { label: 'Servicios', href: '#Servicios' },
  { label: 'Precios', href: '#Precios' },
  { label: 'Opiniones', href: '#Opiniones' },
];

export const testimonials: Testimonial[] = [
  { user: 'Carlos Martínez', company: 'Tech Solutions', image: 'assets/profile-pictures/user1.jpg', text: 'Estoy muy satisfecho con el servicio de estacionamiento. La reserva en línea es rápida y sencilla, y nunca he tenido problemas para encontrar un espacio.' },
  { user: 'Ana López', company: 'Blue Horizon Technologies', image: 'assets/profile-pictures/user2.jpg', text: 'El sistema de control de acceso es increíblemente eficiente. Me siento segura sabiendo que solo los vehículos autorizados pueden ingresar al parqueadero.' },
  { user: 'David García', company: 'Quantum Innovations', image: 'assets/profile-pictures/user3.jpg', text: 'La atención al cliente es excepcional. Cada vez que he tenido una pregunta o problema, el equipo ha respondido de manera rápida y profesional.' },
  { user: 'Rocío Fernández', company: 'Fusion Dynamics', image: 'assets/profile-pictures/user4.jpg', text: 'Las estaciones de carga para vehículos eléctricos son un gran plus. Ahora puedo cargar mi coche mientras trabajo, lo que me ahorra mucho tiempo.' },
  { user: 'Miguel Torres', company: 'Visionary Creations', image: 'assets/profile-pictures/user5.jpg', text: 'El sistema de pago automatizado es muy conveniente. Puedo pagar desde mi teléfono y salir del parqueadero sin demoras.' },
  { user: 'Elena Sánchez', company: 'Synergy Systems', image: 'assets/profile-pictures/user6.jpg', text: 'La seguridad del parqueadero es excelente. Las cámaras de vigilancia y el personal de seguridad me hacen sentir tranquila al dejar mi coche aquí.' },
];

export const features: Feature[] = [
  { icon: 'chat', text: 'Reservas en Línea', description: 'Permite a los usuarios reservar espacios de estacionamiento en línea de manera rápida y sencilla.' },
  { icon: 'fingerprint', text: 'Control de Acceso', description: 'Sistema de control de acceso mediante reconocimiento de matrículas o tarjetas RFID para una gestión segura y eficiente.' },
  { icon: 'shield', text: 'Seguridad 24/7', description: 'Vigilancia constante con cámaras de seguridad y personal de vigilancia para garantizar la seguridad de los vehículos.' },
  { icon: 'battery', text: 'Carga para Vehículos Eléctricos', description: 'Disponibilidad de estaciones de carga para vehículos eléctricos, facilitando la movilidad sostenible.' },
  { icon: 'plug', text: 'Sistema de Pago Automatizado', description: 'Pago automatizado mediante aplicaciones móviles o máquinas de autoservicio, agilizando la salida del parqueadero.' },
  { icon: 'globe', text: 'Monitoreo en Tiempo Real', description: 'Plataforma de monitoreo en tiempo real que muestra la disponibilidad de espacios y el estado del parqueadero.' },
];

export const checklistItems: ChecklistItem[] = [
  { title: 'Gestión de Espacios en Tiempo Real', description: 'Monitorea y gestiona la disponibilidad de espacios de estacionamiento en tiempo real para optimizar el uso del parqueadero.' },
  { title: 'Reservas Automatizadas', description: 'Permite a los usuarios reservar espacios de estacionamiento de manera rápida y sencilla a través de una aplicación móvil o sitio web.' },
  { title: 'Sistema de Pago Integrado', description: 'Facilita el proceso de pago con opciones de pago en línea y en sitio, agilizando la salida de los vehículos.' },
  { title: 'Control de Acceso Avanzado', description: 'Implementa tecnologías como reconocimiento de matrículas y tarjetas RFID para un control de acceso seguro y eficiente.' },
  { title: 'Seguridad y Vigilancia', description: 'Ofrece vigilancia constante con cámaras de seguridad y personal de vigilancia para garantizar la seguridad de los vehículos.' },
  { title: 'Soporte para Vehículos Eléctricos', description: 'Incluye estaciones de carga para vehículos eléctricos, promoviendo la movilidad sostenible.' },
];

export const pricingOptions = [
  { title: 'Carro', price: '$4.000/Hora', features: ['Gestión de 1 vehículo', 'Reservas en línea', 'Control de acceso básico', 'Soporte por correo electrónico'] },
  { title: 'Carro', price: '$24.000/Dia', features: ['Gestión de 1 vehículo', 'Reservas en línea', 'Control de acceso básico', 'Soporte por correo electrónico'] },
  { title: 'Carro', price: '$294.000/mes', features: ['Gestión de 1 vehículo', 'Reservas en línea', 'Control de acceso básico', 'Soporte por correo electrónico'] },
  { title: 'Motocicleta', price: '$1.000/Hora', features: ['Gestión de 1 vehículo', 'Reservas en línea', 'Control de acceso básico', 'Soporte por correo electrónico'] },
  { title: 'Motocicleta', price: '$3.400/Dia', features: ['Gestión de 1 vehículo', 'Reservas en línea', 'Control de acceso básico', 'Soporte por correo electrónico'] },
  { title: 'Motocicleta', price: '$62.000/mes', features: ['Gestión de 1 vehículo', 'Reservas en línea', 'Control de acceso básico', 'Soporte por correo electrónico'] },
];

export const resourcesLinks: FooterLink[] = [
  { href: '#', text: 'Cómo Funciona' },
  { href: '#', text: 'Guía de Usuario' },
  { href: '#', text: 'Preguntas Frecuentes' },
  { href: '#', text: 'Soporte Técnico' },
  { href: '#', text: 'Políticas de Privacidad' },
];

export const platformLinks: FooterLink[] = [
  { href: '#', text: 'Reservas en Línea' },
  { href: '#', text: 'Control de Acceso' },
  { href: '#', text: 'Sistema de Pago' },
  { href: '#', text: 'Seguridad y Vigilancia' },
  { href: '#', text: 'Soporte para Vehículos Eléctricos' },
];

export const communityLinks: FooterLink[] = [
  { href: '#', text: 'Eventos y Promociones' },
  { href: '#', text: 'Testimonios de Clientes' },
  { href: '#', text: 'Blog y Noticias' },
  { href: '#', text: 'Trabaja con Nosotros' },
  { href: '#', text: 'Contacto' },
];
