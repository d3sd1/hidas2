# flights scraper

## pasos para instalar

- clonar repositorio
- npm i
- crear fichero .env

## como ejecutar

npm run dev

## versiones

angular 16
node 20

## consideraciones

- se usa expressjs ya que realizar los endpoint con node plano iba a cmplicar la prueba tanto para hacerla como para
  leela, asi que uso expressjs que es algo qure habeis comentado que se usa
- se agregan comandos basicos al package para actividades basicas como ejcutar, probar, y realizar lintern sobre el
  codigo para verificar que se cumplen las reglas y criterios de programacion
- se usa nodemon para recargar codigo segun se programa
- no se utiliza dependency injection / servicios ya que se espera un codigo en node con typescript, no obstante seria lo
  suyo implementarlo con dic / nestjs, trabajando con servicios y patron mvc en lugar de programacion funcional
- se han utilizado modulos y no commonjs, por indefinicion en este aspecto, no se han utilizado clases aunque tambien
  seria lo suyo
- Se ha usado xpath en pupeeter frente a clases etc. ya que las clases cambian y se ofuscan en funcion de la version del
  despliegue en google, mientras que el xpath va a ser persistente mientras no existan cambios en la pagina que se
  opera, mientras que usando clases si google actualiza la app en cualquier sitio (se re-despliega) fallaria en esta
  nuea version
- Se utilizan los wait para prevenir que el bot haga cosas antes de que carguen, no se ha usado ningun elemento temporal
  ya que esperar 3 segundos no es sinonimo de que funcione (p.e. problemas de conectividad o red lenta)
- Se pone lenguaje en ingles al cargar la pagina para no tener problema de fechas
- se consideraba cachear la informacion, no se ha hecho para agilizar el tramite
- se planteaba un diseño api first, para probar se proporciona en su lugar una colecion de postman
- estaria bien encapsular con docker front y back para hacer una sola app en el runtime
- no se hacen test por falta de tiempo, pero se proporciona un ejemplo con jest
- la aplicacion valida el campo from/ to directamente en el robot, por ende no se necesita validacion en front mas que
  el campo no sea nulo o vacio
- solo hay un commit, lo suyo es ir poniendo commit por cada tarea. dado que es una prueba de nivel, no se ha
  considerado
- se ha mejorado la calidad de codigo escaneandolo con sonar, pero no tengo un template de lint normalizado acorde al proyecto, asi que me lo he "inventado"

NOTA IMPORTANTE: HE CONSIDERADO LO MAS IMPORTANTE DE LA PRUEBA LA ORGANIZACION DEL CODIGO, IMPLEMENTAR EL PATRON SAGA EN
EL ROBOT DE PUPEETER Y TENER CUIDADO DE LOS LEAK EN ANGULAR (DESTROY).
SE PUEDEN IMPLEMENTAR LAS CONSIDERADCIONES SI SE ESTIMA NECESARIO SIN PROBLEMA.
