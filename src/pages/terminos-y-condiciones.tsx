import Navbar from "@/components/ui/navbar";
import Footer from "@/components/home/footer";

const TerminosYCondiciones = () => {
    return (
        <div className="min-h-svh bg-white text-white w-full flex flex-col items-center justify-start overflow-hidden">
            <div className="w-full bg-blue-500 p-7">
                <Navbar variant="dark" />
            </div>

            <main className="text-blue-500 w-full max-w-screen-xl flex flex-col items-center justify-start py-10 px-7 2xl:px-0">
                <div className="w-full max-w-4xl">
                    <h1 className="text-3xl font-bold font-century-gothic text-center mb-8">
                        Términos y Condiciones
                    </h1>

                    <div className="space-y-6 font-century-gothic text-base leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold mb-3">PRIMERA: OBJETO</h2>
                            <p>
                                El objeto del presente contrato de adhesión es regular las políticas de uso y condiciones de la plataforma SEKTOR APP,
                                además de los derechos y obligaciones de cada uno de los usuarios y afiliados a dicha plataforma.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">SEGUNDA: ACEPTACIÓN DE LOS TÉRMINOS</h2>
                            <p>
                                Al acceder a la aplicación móvil SEKTOR APP usted acepta estar sujeto a los términos y condiciones de uso y a todas
                                las regulaciones aplicables. De no estar de acuerdo con algunos de los términos, le recomendamos no acceder a la aplicación.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">TERCERA: DESCRIPCIÓN DE LOS SERVICIOS</h2>
                            <p>
                                SEKTOR APP es una plataforma móvil ligada al ramo asegurador venezolano y orientada a integrar, conectar y facilitar
                                la labor de agentes exclusivos, corredores de seguros, sociedades de corretajes, inspectores de riesgo, peritos valuadores,
                                médicos, clínicas, talleres aliados y demás profesionales vinculados al ramo, con la finalidad de que el usuario tenga
                                acceso rápido, fácil y seguro, desde cualquier parte del mundo a través de diversos dispositivos electrónicos al servicio
                                que tenga a bien solicitar.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">CUARTA: REGISTRO DE USUARIO</h2>
                            <p>
                                Para acceder a SEKTOR APP, deberá contar con más de dieciocho años de edad, ser legalmente hábil y poseer documento
                                de identidad vigente. Posteriormente podrá registrarse creando una cuenta donde suministre datos como nombre, apellido,
                                número de identidad, fecha de nacimiento, dirección de correo electrónico, teléfono, dirección de habitación. El usuario
                                es responsable de mantener la confidencialidad de su contraseña y de todas las actividades que ocurren bajo su cuenta.
                                La plataforma se reserva al derecho de suspender o cancelar su cuenta si hay sospechas de información falsa o inexacta.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">QUINTA: OBLIGACIONES Y PROHIBICIONES DEL USUARIO</h2>
                            <p>
                                El usuario se compromete a utilizar la aplicación SEKTOR APP única y exclusivamente para fines legales y permitidos,
                                proporcionar información precisa, mantener la confidencialidad, informar sobre fallas o uso indebido y cumplir con las
                                normas de uso. Esto incluye no realizar actividades que infrinjan los derechos de autor o propiedad intelectual, ni
                                actividades con contenido ofensivo o difamatorio, o que violen la privacidad de otros usuarios. No podrá hackear,
                                alterar o dañar la aplicación ni sus servidores, ni podrá usarla para fines fraudulentos o ilícitos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">SEXTA: PRIVACIDAD</h2>
                            <p>
                                El uso de la aplicación SEKTOR APP está sujeto a nuestra política de privacidad, que explica como recopilamos,
                                utilizamos, almacenamos, protegemos y compartimos su información personal con la finalidad de generar confianza y
                                transparencia. Al aceptar estos términos también acepta nuestra política de privacidad.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">SÉPTIMA: USO Y PROTECCIÓN DE DATOS PERSONALES</h2>
                            <p>
                                Los datos personales serán tratados conforme a la normativa vigente en materia de protección de datos, para ello,
                                SEKTOR APP implementará las medidas adecuadas para garantizar la confidencialidad e integridad de la información.
                            </p>
                            <p className="mt-3">
                                Los datos personales serán usados única y exclusivamente para la gestión de la cuenta, prestación de servicios,
                                facturación y cobro de planes. Bajo ninguna circunstancia se cederán estos datos a terceros sin consentimiento
                                expreso del usuario, reservándose el derecho de divulgar algún dato personal si la ley lo requiere o si fuera
                                necesario para cumplir con una obligación legal, proteger o defender nuestros derechos o propiedad, prevenir o
                                investigar irregularidades o proteger a la plataforma contra responsabilidades legales. Es importante destacar
                                que toda la información relacionada con pagos está encriptada y es procesada de forma segura.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">OCTAVA: ENLACES O SITIOS DE TERCEROS</h2>
                            <p>
                                La aplicación puede contener enlaces, sitios web o servicios de terceros, los cuales SEKTOR APP no controla ni
                                es responsable del contenido, las políticas de privacidad o las prácticas de estos. Sin embargo, el usuario
                                autoriza a SEKTOR APP para compartir sus datos personales con la finalidad de facilitarles el acceso a los
                                servicios que puedan brindar otras empresas. Le recomendamos antes de ingresar a estos sitios, revisar los
                                términos y condiciones de los mismos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">NOVENA: VALIDACIÓN DE CREDENCIALES PROFESIONALES</h2>
                            <p>
                                SEKTOR APP validará las acreditaciones que el usuario declare frente a fuentes oficiales de organismos estatales
                                y registros de empresas privadas mediante accesos públicos y procedimientos aprobados, sin vulnerar la privacidad
                                del usuario. La plataforma se reserva el derecho de cancelar la cuenta a cualquier usuario que omita información
                                relevante o suministro datos falsos o incompletos al entenderse contrario al objeto de credibilidad y seguridad
                                de la plataforma.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">DÉCIMA: DOMICILIACIÓN DE PAGOS Y PLANES DE AFILIACIÓN</h2>
                            <p>
                                Algunos servicios de SEKTOR APP requieren suscripción o pago según planes especiales, por lo que el usuario
                                autoriza la domiciliación bancaria o cargo a tarjeta de crédito/debito por el importe y duración del plan
                                seleccionado. La renovación se realizará de forma automática al término de cada período, salvo previa notificación
                                de culminación de su suscripción.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">DÉCIMA PRIMERA: MÉTODOS DE PAGO Y MONEDA DE REFERENCIA</h2>
                            <p>
                                SEKTOR APP dispondrá de los siguientes mecanismos de pago: Transferencia bancaria, pago móvil, depósito bancario,
                                TDC y débito, Zelle, Paypal, Cashea y cualquier otro mecanismo que pudiere incorporar la plataforma para proteger
                                y mejorar la experiencia del usuario. Todos y cada uno de los montos se establecerán en dólares estadounidenses
                                como moneda de referencia, en virtud de preservar el equilibrio económico entre los usuarios y las empresas
                                afiliadas a SEKTOR APP, evitando así fluctuaciones que puedan afectar a cualquiera de las partes. No obstante,
                                los pagos realizados a través de la plataforma podrán ser en Bolívares, calculados a la tasa del Banco Central
                                de Venezuela correspondiente al día del pago.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">DÉCIMA SEGUNDA: NOTIFICACIÓN DE LOS PAGOS Y SU VERIFICACIÓN</h2>
                            <p>
                                El usuario se compromete a realizar la debida notificación y/o registro de los pagos a través de la aplicación
                                de SEKTOR APP, con el fin de que puedan ser verificados. Una vez verificado, el compromiso de pago pendiente
                                será considerado como cancelado. En caso de que el pago no sea verificado o presente algún inconveniente con
                                su registro, podrá comunicarse con atención al cliente a través de nuestra aplicación para recibir el soporte
                                correspondiente.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">DÉCIMA TERCERA: ACEPTACIÓN A LAS COMUNICACIONES</h2>
                            <p>
                                El usuario acepta que SEKTOR APP o terceros contratados por dicha empresa puedan enviar mensajes de texto,
                                WhatsApp, notificaciones push, mensajes por redes sociales, correos electrónicos y llamadas telefónicas,
                                con el fin de recordar el pago de planes, notificar sobre nuevos afiliados, realizar campañas de marketing,
                                informar sobre descuentos, promociones y cualquier otro concepto que se considere relevante.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">DÉCIMA CUARTA: TERMINACIÓN DE LA CUENTA Y POLÍTICA DE REEMBOLSO</h2>
                            <p>
                                El usuario de la plataforma SEKTOR APP podrá cancelar su cuenta y darse de baja independientemente del motivo
                                y en cualquier momento, surtiendo efecto de manera inmediata. No obstante los cargos ya efectuados correspondientes
                                al periodo en curso no son reembolsables, incluyendo cualquier plan de suscripción no utilizado.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">DECIMA QUINTA: LIMITACIÓN DE RESPONSABILIDAD</h2>
                            <p>
                                SEKTOR APP no se hace responsable de daños directos, indirectos, incidentales, especiales o consecuentes que
                                resulten del uso o la imposibilidad de uso de la aplicación como pérdida de datos, interrupción de negocios
                                o cualquier otro daño financiero.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">DÉCIMA SEXTA: RECLAMOS</h2>
                            <p>
                                Para SEKTOR APP todos y cada uno de nuestros usuarios y afiliados son importantes y respetamos su derecho a
                                recibir un servicio justo, rápido y cordial en todo momento. Si el usuario ha tenido algún tipo de inconveniente
                                con la plataforma y quiere presentar un reclamo formal, podrá hacerlo a través de los mecanismos de atención
                                al cliente de la misma. Nuestro objetivo es resolver los reclamos en el menor tiempo posible.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">DÉCIMA SÉPTIMA: PROPIEDAD INTELECTUAL</h2>
                            <p>
                                Todo el contenido de la plataforma incluyendo diseños, marcas, logotipos, emblemas, eslóganes, gráficos,
                                imágenes, textos, software, código de la aplicación son propiedad de SEKTOR APP y están protegidos por las
                                normas que regulan la materia en cuanto a derecho de autor y propiedad intelectual. SEKTOR APP se reserva
                                todos los derechos sobre la totalidad de dichos contenidos, por consiguiente, los usuarios no podrán utilizar
                                estos contenidos de formas que no sean necesarias o que no estén implícitas en el uso adecuado de la plataforma.
                                Queda estrictamente prohibido copiar, reproducir, descargar, compartir, modificar, traducir, transformar,
                                publicar, transmitir, sublicenciar, editar, transferir, vender o ceder a terceros ni crear obras derivadas
                                de los contenidos disponibles en SEKTOR APP.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">DÉCIMA OCTAVA: MODIFICACIÓN DE LOS TÉRMINOS</h2>
                            <p>
                                SEKTOR APP se reserva el derecho de modificar, ampliar, reemplazar o restringir total o parcialmente los
                                términos y condiciones en cualquier momento previa notificación del usuario. El uso continuado de la aplicación
                                posterior a la publicación de los cambios significa que el usuario acepta los nuevos términos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">DÉCIMA NOVENA: JURISDICCIÓN Y LEGISLACIÓN APLICABLE</h2>
                            <p>
                                Los términos del presente contrato de adhesión se regirán e interpretarán conforme al ordenamiento jurídico
                                de la República Bolivariana de Venezuela, cualquier controversia suscitada relacionada con estos términos
                                será resuelta de forma exclusiva y excluyente en la jurisdicción de los tribunales de la ciudad de Valencia,
                                estado Carabobo.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">VIGÉSIMA: ACEPTACIÓN DE LOS TÉRMINOS Y CONDICIONES</h2>
                            <p>
                                Finalmente, el usuario expresamente declara que: Ha leído y comprendido íntegramente el contenido de los
                                presentes Términos y Condiciones y está de acuerdo con todos y cada uno de ellos. Acepta libre y voluntariamente
                                las obligaciones que le incumben y se compromete a cumplir con todas las disposiciones de los presentes
                                Términos y Condiciones.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TerminosYCondiciones;
