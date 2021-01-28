use store
db.createCollection('upload')

use paper
db.information.remove({})

db.information.insertMany([
    {
        algorithm: "teco-gans",
        algorithmLabel: "Temporal Coherence via GANs",
        styles: [
            {
                name: "pre-train",
                label: "Pre-Train",
                rate: 0
            },
            {
                name: "general",
                label: "General",
                rate: 0
            }
        ],
        paper: "Learning Temporal Coherence via Self-Supervision for GAN-based Video Generation",
        link: "https://arxiv.org/pdf/1811.09393.pdf",
        technique: "Generative Adversarial Networks",
        authors: "MENGYU CHU, YOU XIE, JONAS MAYER, LAURA LEAL-TAIXÉ, and NILS THUEREY, Technical University of Munich, Germany",
        type: "video"
    },
    {
        algorithm: "sr-gans",
        algorithmLabel: "Super-Resolution via GANs",
        styles: [
            {
                name: "general",
                label: "General",
                rate: 0
            },
            {
                name: "portrait",
                label: "Portrait",
                rate: 0
            },
            {
                name: "landscape",
                label: "Landscape",
                rate: 0
            }
        ],
        paper: "Photo-Realistic Single Image Super-Resolution Using a Generative Adversarial Network",
        link: "https://arxiv.org/pdf/1609.04802.pdf",
        technique: "Generative Adversarial Networks",
        authors: "Christian Ledig, Lucas Theis, Ferenc Husza ́r, Jose Caballero, Andrew Cunningham, Alejandro Acosta, Andrew Aitken, Alykhan Tejani, Johannes Totz, Zehan Wang, Wenzhe Shi Twitter",
        type: "image"
    },
    {
        algorithm: "car",
        algorithmLabel: "Content Adaptive Resampler",
        styles: [
            {
                name: "general",
                label: "General",
                rate: 0
            }
        ],
        paper: "Learned Image Downscaling for Upscaling using Content Adaptive Resampler",
        link: "https://arxiv.org/pdf/1907.12904v2.pdf",
        technique: "Content Adaptive Resampler",
        authors: "Wanjie Sun and Zhenzhong Chen School of Remote Sensing and Information Engineering, Wuhan University",
        type: "image"
    }
])