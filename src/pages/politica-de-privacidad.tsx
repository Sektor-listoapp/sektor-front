import Navbar from "@/components/ui/navbar";
import Footer from "@/components/home/footer";

const PoliticaDePrivacidad = () => {
    return (
        <div className="min-h-svh bg-white text-white w-full flex flex-col items-center justify-start overflow-hidden">
            <div className="w-full bg-blue-500 p-7">
                <Navbar variant="dark" />
            </div>

            <main className="text-blue-500 w-full max-w-screen-xl flex flex-col items-center justify-start py-10 px-7 2xl:px-0">
                <div className="w-full max-w-4xl">
                    <h1 className="text-3xl font-bold font-century-gothic text-center mb-8">
                        Política de Privacidad – Sektor App
                    </h1>

                    <p className="font-century-gothic text-base text-center mb-8">
                        Última actualización: 21 de mayo de 2026
                    </p>

                    <div className="space-y-6 font-century-gothic text-base leading-relaxed">
                        <section>
                            <p>
                                Sektor App respeta la privacidad de sus usuarios. Esta Política de Privacidad describe cómo se maneja la información cuando utilizas nuestra aplicación móvil.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">Información que no recopilamos</h2>
                            <p>
                                Sektor App no recopila, almacena, procesa ni comparte información personal de los usuarios a través de la aplicación.
                            </p>
                            <p className="mt-3">
                                En particular, la aplicación no recopila:
                            </p>
                            <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                                <li>Nombre</li>
                                <li>Correo electrónico</li>
                                <li>Número telefónico</li>
                                <li>Datos de ubicación</li>
                                <li>Identificadores del dispositivo</li>
                                <li>Información financiera</li>
                                <li>Datos de uso con fines de seguimiento</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">Compras dentro de la app</h2>
                            <p>
                                Los pagos y suscripciones realizadas dentro de la aplicación son procesados exclusivamente por Apple mediante App Store / In-App Purchases.
                                Sektor App no tiene acceso a la información de pago del usuario.
                            </p>
                            <p className="mt-3">
                                Apple gestiona estos datos de acuerdo con su propia política de privacidad.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">Facturación digital</h2>
                            <p>
                                Sektor APP cumple cabalmente con todos los requisitos y obligaciones establecidos por la legislación de la República Bolivariana de Venezuela en materia comercial y tributaria. La emisión, validación y envío de la facturación digital se realiza de forma automatizada a través de empresas proveedoras de sistemas de facturación debidamente autorizadas y registradas por el Servicio Integrado de Administración Aduanera y Tributaria (SENIAT).
                            </p>
                            <p className="mt-3">
                                El sistema tecnológico de Sektor APP opera bajo las condiciones de Homologación exigidas por el ente regulador tributario, garantizando el estricto cumplimiento de la normativa de venta digital nacional. Al efectuar cualquier pago, compra o suscripción dentro de la aplicación, el usuario acepta y reconoce que su soporte fiscal será emitido y transmitido exclusivamente de manera electrónica a su dirección de correo registrado, contando con plena validez legal y fiscal en todo el territorio nacional.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">Uso de la información</h2>
                            <p>
                                Dado que no recopilamos información personal, no utilizamos datos del usuario para ningún propósito, incluyendo análisis, publicidad o seguimiento.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">Servicios de terceros</h2>
                            <p>
                                La aplicación puede utilizar servicios proporcionados por Apple (como App Store e In-App Purchases), los cuales están sujetos a sus propias políticas de privacidad.
                                Sektor App no controla ni es responsable de las prácticas de privacidad de terceros.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">Privacidad de menores</h2>
                            <p>
                                Sektor App no está dirigida específicamente a menores de edad y no recopila conscientemente información de menores.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">Cambios en esta política</h2>
                            <p>
                                Podemos actualizar esta Política de Privacidad ocasionalmente.
                                Cualquier cambio será publicado en esta misma página.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">Contacto</h2>
                            <p>
                                Si tienes preguntas sobre esta Política de Privacidad o sobre la app, puedes contactarnos en:
                            </p>
                            <div className="mt-3 space-y-2">
                                <p>
                                    📧 <a href="mailto:sektor.listoapp@gmail.com" className="text-blue-600 hover:text-blue-800 underline">sektor.listoapp@gmail.com</a>
                                </p>
                                <p>
                                    🌐 <a href="https://sektor.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">https://sektor.app</a>
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PoliticaDePrivacidad;
