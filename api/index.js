import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { q: query, by: source } = req.query;

    // ¡¡ADVERTENCIA DE SEGURIDAD!!
    // Esta clave API está incrustada directamente en el código.
    // Esto es EXTREMADAMENTE PELIGROSO para un entorno de producción o público.
    // Cualquiera que vea este código tendrá acceso a tu clave SerpApi.
    // Para un uso real, DEBERÍAS usar variables de entorno (process.env.SERPAPI_API_KEY).
    const serpApiKey = "f6fa451fbe5750f932c840447910e3b1d7ff727391c5b9807493f6b17e43fb20";

    if (!query) {
        return res.status(400).json({
            error: "Parámetro 'q' (texto de búsqueda) es requerido.",
            example_url: "https://tudominio.vercel.app/api?q=ejemplo_de_busqueda&by=soblend--utf-5"
        });
    }

    if (source !== 'soblend--utf-5') {
        return res.status(400).json({
            error: "Parámetro 'by' inválido. Debe ser 'soblend--utf-5'.",
            example_url: "https://tudominio.vercel.app/api?q=ejemplo_de_busqueda&by=soblend--utf-5"
        });
    }

    try {
        const serpApiUrl = `https://serpapi.com/search?engine=google&q=${encodeURIComponent(query)}&api_key=${serpApiKey}`;

        const response = await fetch(serpApiUrl);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error de la API de SerpApi: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        let results = [];
        if (data.organic_results) {
            results = data.organic_results.map(item => ({
                title: item.title,
                link: item.link,
                snippet: item.snippet
            }));
        }

        res.status(200).json({
            query: query,
            source: source,
            message: `Resultados de búsqueda para "${query}"`,
            results: results,
            search_information: {
                total_results: data.search_information ? data.search_information.total_results : 0,
                time_taken: data.search_information ? data.search_information.time_taken : 0
            }
        });

    } catch (error) {
        console.error("Error al realizar la búsqueda con SerpApi:", error);
        res.status(500).json({
            error: "Ocurrió un error al procesar tu búsqueda con SerpApi.",
            details: error.message
        });
    }
          }
