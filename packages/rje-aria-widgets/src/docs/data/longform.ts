import { JsonSchema } from 'headless-json-editor';

export const schema: JsonSchema = {
    title: 'Longform',
    type: 'object',
    required: ['header', 'intro', 'modules', 'furtherReading', 'seo', 'socialMedia', 'credits', 'dev'],
    properties: {
        id: {
            type: 'string',
            default: 'd98124af'
        },
        header: {
            title: 'Artikel',
            type: 'object',
            required: ['theme', 'datePublished'],
            properties: {
                theme: {
                    title: 'Stil der Headerleiste',
                    type: 'string',
                    enum: ['light', 'dark'],
                    options: {
                        enumTitles: ['Heller Headerbalken', 'Dunkler Headerbalken']
                    }
                },
                datePublished: {
                    title: 'Veröffentlichungsdatum',
                    description:
                        'Im Format YYYY-MM-DD HH:mm<br>YYYY: Vierstelliges Jahr<br>MM: Monat evtl. mit führender Null<br>DD: Tag evtl. mit führender Null<br>HH: Stunde evtl. mit führender Null<br>mm: Minute evtl. mit führender Null',
                    type: 'string',
                    pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}'
                }
            }
        },
        intro: {
            title: 'Artikeltitel',
            type: 'object',
            additionalProperties: false,
            required: ['title', 'subtitle', 'caption', 'author', 'yAlign', 'displayMode', 'image', 'video'],
            properties: {
                title: {
                    type: 'string',
                    format: 'html',
                    title: 'Artikelüberschrift *',
                    minLength: 1
                },
                caption: {
                    type: 'string',
                    format: 'html',
                    title: 'Dachzeile',
                    description: 'Erscheint über der Überschrift.'
                },
                subtitle: {
                    type: 'string',
                    format: 'html',
                    title: 'Subtitel',
                    description: 'Längerer Text unterhalb des Titels'
                },
                author: {
                    type: 'string',
                    title: 'Autorenzeile',
                    description: 'Die Autorenzeile erscheint kursiv unter der Artikelüberschrift'
                },
                yAlign: {
                    title: 'Vertikale Textausrichtung',
                    description: 'Vertikale Ausrichtung der Überschrift im Verhältnis zum Hintergrundbild',
                    type: 'string',
                    enum: ['top', 'middle', 'bottom'],
                    default: 'bottom',
                    options: {
                        enumTitles: ['oben', 'mittig', 'unten']
                    }
                },
                image: {
                    type: 'object',
                    additionalProperties: false,
                    required: ['desktop', 'mobile'],
                    options: {
                        showTitle: false
                    },
                    properties: {
                        desktop: {
                            type: 'object',
                            required: ['url', 'quality'],
                            options: {
                                showTitle: false,
                                'max-height': '250px',
                                maxWidth: 1920,
                                maxHeight: 1080
                            },
                            format: 'mediaImage',
                            devicePixelRatio: 2,
                            minWidth: 320,
                            minHeight: 320,
                            properties: {
                                url: {
                                    title: 'Introbild. BildService-ID *',
                                    description: 'Ein hochauflösendes Bild im Querformat als Titelbild',
                                    type: 'string',
                                    minLength: 1
                                },
                                quality: {
                                    title: 'Bildqualität',
                                    format: 'range',
                                    type: 'number',
                                    minimum: 1,
                                    maximum: 100,
                                    default: 70
                                }
                            }
                        },
                        mobile: {
                            type: 'object',
                            required: ['url', 'quality'],
                            options: {
                                collapsed: true,
                                showTitle: false,
                                'max-height': '120px',
                                maxWidth: 750,
                                maxHeight: 750
                            },
                            format: 'mediaImage',
                            devicePixelRatio: 2,
                            minWidth: 320,
                            minHeight: 320,
                            properties: {
                                url: {
                                    title: 'Alternatives Bild für mobiles Layout. BildService-ID',
                                    type: 'string'
                                },
                                quality: {
                                    title: 'Bildqualität',
                                    format: 'range',
                                    type: 'number',
                                    minimum: 1,
                                    maximum: 100,
                                    default: 70
                                }
                            }
                        }
                    }
                },
                video: {
                    title: 'Optionales Introvideo',
                    type: 'object',
                    required: ['url', 'loop', 'type'],
                    options: {
                        showTitle: false
                    },
                    properties: {
                        url: {
                            title: 'BildService-ID des Videos',
                            type: 'string',
                            format: 'mediaVideo',
                            description: 'Ein Introvideo das automatisch auf Desktop-Geräten abgespielt wird.'
                        },
                        loop: {
                            title: 'Loop Video',
                            format: 'checkbox',
                            type: 'boolean',
                            default: true
                        },
                        type: {
                            title: 'Medientyp',
                            type: 'string',
                            default: 'video',
                            options: {
                                hidden: true
                            }
                        }
                    }
                },
                displayMode: {
                    title: 'Darstellung des Intros',
                    type: 'string',
                    enum: ['parallax', 'inline'],
                    default: 'parallax',
                    options: {
                        enumTitles: [
                            'Bild und Video im Hintergrund als Parallaxe einblenden',
                            'Intro-Bild im Dokumentfluss anzeigen'
                        ]
                    }
                }
            }
        },
        modules: {
            type: 'array',
            title: 'Artikelinhalt',
            format: 'table',
            options: {
                layout: {
                    // type: 'cards'
                }
            },
            items: {
                title: 'Modul',
                // @ts-ignore
                options: {
                    disable_collapse: true,
                    keep_oneof_values: false
                },
                oneOf: [
                    {
                        id: 'textModule',
                        type: 'object',
                        title: 'Text',
                        oneOfProperty: 'partial',
                        additionalProperties: false,
                        required: ['partial', 'text'],
                        properties: {
                            partial: {
                                type: 'string',
                                // @ts-ignore
                                options: {
                                    hidden: true
                                },
                                default: 'app/src/modules/text/text',
                                pattern: '^app/src/modules/text/text'
                            },
                            text: {
                                type: 'object',
                                required: ['withInitial', 'content'],
                                additionalProperties: false,
                                // @ts-ignore
                                options: {
                                    showTitle: false
                                },
                                properties: {
                                    withInitial: {
                                        title: 'Text beginnt mit einer Initiale',
                                        type: 'boolean',
                                        default: false,
                                        format: 'checkbox'
                                    },
                                    content: {
                                        title: 'Text',
                                        type: 'string',
                                        format: 'html',
                                        options: {
                                            mediumEditor: {
                                                buttons: ['h2', 'h3', 'bold', 'italic', 'anchor', 'removeFormat']
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        id: 'imageModule',
                        type: 'object',
                        title: 'Bild',
                        additionalProperties: false,
                        required: ['partial', 'image'],
                        // @ts-ignore
                        options: {
                            disable_collapse: true
                        },
                        properties: {
                            partial: {
                                type: 'string',
                                options: {
                                    hidden: true
                                },
                                default: 'app/src/modules/image/image',
                                pattern: '^app/src/modules/image/image'
                            },
                            image: {
                                type: 'object',
                                additionalProperties: false,
                                required: ['desktop', 'mobile', 'caption', 'source', 'displayMode', 'animated'],
                                // @ts-ignore
                                options: {
                                    showTitle: false
                                },
                                properties: {
                                    desktop: {
                                        type: 'object',
                                        format: 'mediaImage',
                                        devicePixelRatio: 2,
                                        minWidth: 456,
                                        minHeight: 304,
                                        // @ts-ignore
                                        options: {
                                            showTitle: false,
                                            maxWidth: 1320,
                                            maxHeight: 1320
                                        },
                                        required: ['url', 'quality'],
                                        properties: {
                                            url: {
                                                title: 'BildService-ID *',
                                                type: 'string',
                                                minLength: 1
                                            },
                                            quality: {
                                                title: 'Bildqualität',
                                                format: 'range',
                                                type: 'number',
                                                minimum: 1,
                                                maximum: 100,
                                                default: 70
                                            }
                                        }
                                    },
                                    mobile: {
                                        media: 'image',
                                        type: 'object',
                                        format: 'mediaImage',
                                        title: 'BildService-ID *',
                                        devicePixelRatio: 2,
                                        minWidth: 456,
                                        minHeight: 304,
                                        // @ts-ignore
                                        options: {
                                            showTitle: false,
                                            maxWidth: 750,
                                            maxHeight: 750
                                        },
                                        required: ['url', 'quality'],
                                        properties: {
                                            url: {
                                                title: 'Alternatives Bild für mobiles Layout. BildService-ID',
                                                type: 'string'
                                            },
                                            quality: {
                                                title: 'Bildqualität',
                                                format: 'range',
                                                type: 'number',
                                                minimum: 1,
                                                maximum: 100,
                                                default: 70
                                            }
                                        }
                                    },
                                    caption: {
                                        title: 'Bildunterschrift',
                                        type: 'string'
                                    },
                                    source: {
                                        title: 'Quellenangabe',
                                        type: 'string',
                                        format: 'html',
                                        description:
                                            'Wird automatisch aus BildService befüllt wenn nichts angegeben wurde.'
                                    },
                                    displayMode: {
                                        title: 'Anzeigemodus',
                                        description:
                                            'Legt fest, ob der nachfolgende Text um das Bild fließen soll oder ob das Bild die ganze Spaltenbreite einnimmt. Auf kleinen Bildschirmen wird das Bild jedoch immer vollbreit angezeigt.',
                                        type: 'string',
                                        default: 'text-wide',
                                        enum: ['float-left', 'float-right', 'text-wide', 'expanded', 'fullwidth'],
                                        // @ts-ignore
                                        options: {
                                            enumTitles: [
                                                'Bild links',
                                                'Bild rechts',
                                                'Textbreit',
                                                'Überbreit',
                                                'Vollbreit'
                                            ]
                                        }
                                    },
                                    animated: {
                                        // @ts-ignore
                                        options: {
                                            hidden: true
                                        },
                                        type: 'object'
                                    }
                                }
                            }
                        }
                    },
                    {
                        id: 'fullscreenGalleryModule',
                        type: 'object',
                        title: 'Blender - Bildergalerie',
                        required: ['partial', 'theme', 'slides'],
                        properties: {
                            partial: {
                                type: 'string',
                                // @ts-ignore
                                options: {
                                    hidden: true
                                },
                                default: 'app/src/modules/blender/imageBlender',
                                pattern: '^app/src/modules/blender/imageBlender'
                            },
                            theme: {
                                title: 'Hintergrund',
                                type: 'string',
                                enum: ['light', 'dark'],
                                default: 'light',
                                // @ts-ignore
                                options: {
                                    hidden: true,
                                    enumTitles: ['hell', 'dunkel']
                                }
                            },
                            slides: {
                                type: 'object',
                                title: '',
                                // @ts-ignore
                                options: {
                                    showTitle: false
                                },
                                required: ['displayMode', 'default', 'fallback'],
                                properties: {
                                    displayMode: {
                                        title: 'Bildeinpassung',
                                        type: 'string',
                                        enum: ['contain', 'cover'],
                                        default: 'contain',
                                        // @ts-ignore
                                        options: {
                                            enumTitles: [
                                                'Bilder so einbinden, dass sie komplett sichtbar sind',
                                                'Bilder so einbinden, dass sie den kompletten Bildschirm abdecken'
                                            ]
                                        }
                                    },
                                    default: {
                                        type: 'array',
                                        title: 'Bildergalerie',
                                        // @ts-ignore
                                        options: {
                                            collapsed: true
                                        },
                                        minItems: 1,
                                        items: {
                                            type: 'object',
                                            title: 'Bild',
                                            options: {
                                                showTitle: false
                                            },
                                            required: ['desktop', 'mobile'],
                                            properties: {
                                                desktop: {
                                                    type: 'object',
                                                    required: ['url', 'quality'],
                                                    format: 'mediaImage',
                                                    devicePixelRatio: 2,
                                                    minWidth: 320,
                                                    minHeight: 320,
                                                    // @ts-ignore
                                                    options: {
                                                        'max-height': '250px',
                                                        maxWidth: 1320,
                                                        maxHeight: 1320
                                                    },
                                                    properties: {
                                                        url: {
                                                            title: 'Bild. BildService-ID *',
                                                            type: 'string',
                                                            minLength: 1
                                                        },
                                                        quality: {
                                                            title: 'Bildqualität',
                                                            type: 'number',
                                                            format: 'range',
                                                            minimum: 1,
                                                            maximum: 100,
                                                            default: 70
                                                        }
                                                    }
                                                },
                                                mobile: {
                                                    type: 'object',
                                                    required: ['url', 'quality'],
                                                    format: 'mediaImage',
                                                    devicePixelRatio: 2,
                                                    minWidth: 320,
                                                    minHeight: 320,
                                                    // @ts-ignore
                                                    options: {
                                                        'max-height': '250px',
                                                        maxWidth: 750,
                                                        maxHeight: 750
                                                    },
                                                    properties: {
                                                        url: {
                                                            title: 'Alternatives Bild für schmale Bildschirmgrößen. BildService-ID',
                                                            type: 'string'
                                                        },
                                                        quality: {
                                                            title: 'Bildqualität',
                                                            type: 'number',
                                                            format: 'range',
                                                            minimum: 1,
                                                            maximum: 100,
                                                            default: 70
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    fallback: {
                                        options: {
                                            collapsed: true
                                        },
                                        type: 'array',
                                        title: 'Alternative Galerie für mobile Geräte und andere schmale Fenstergrößen',
                                        description:
                                            'Diese Liste kann ignoriert werden, wenn die eingebundenen Bilder auch mobil gut funktionieren',
                                        items: {
                                            type: 'object',
                                            title: 'Bild',
                                            required: ['image'],
                                            properties: {
                                                image: {
                                                    type: 'object',
                                                    format: 'mediaImage',
                                                    required: ['url', 'quality'],
                                                    devicePixelRatio: 2,
                                                    minWidth: 320,
                                                    minHeight: 480,
                                                    options: {
                                                        maxWidth: 750,
                                                        maxHeight: 750
                                                    },
                                                    properties: {
                                                        url: {
                                                            title: 'Schmales Bild. BildService-ID *',
                                                            type: 'string',
                                                            minLength: 1
                                                        },
                                                        quality: {
                                                            title: 'Bildqualität',
                                                            format: 'range',
                                                            type: 'number',
                                                            minimum: 0,
                                                            maximum: 100,
                                                            default: 70
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        id: 'parralaxModule',
                        type: 'object',
                        title: 'Parallax',
                        additionalProperties: false,
                        required: ['partial', 'parallax'],
                        properties: {
                            partial: {
                                type: 'string',
                                options: {
                                    hidden: true
                                },
                                default: 'app/src/modules/parallax/parallax',
                                pattern: '^app/src/modules/parallax/parallax'
                            },
                            parallax: {
                                type: 'object',
                                required: ['title', 'caption', 'image'],
                                properties: {
                                    title: {
                                        type: 'string',
                                        title: 'Überschrift'
                                    },
                                    caption: {
                                        type: 'string',
                                        title: 'Dachzeile',
                                        description: 'Erscheint über der Überschrift.'
                                    },
                                    image: {
                                        type: 'object',
                                        additionalProperties: false,
                                        required: ['desktop', 'mobile'],
                                        options: {
                                            showTitle: false
                                        },
                                        properties: {
                                            desktop: {
                                                type: 'object',
                                                format: 'mediaImage',
                                                title: 'BildService-ID *',
                                                devicePixelRatio: 2,
                                                minWidth: 300,
                                                minHeight: 400,
                                                options: {
                                                    showTitle: false,
                                                    maxWidth: 1320,
                                                    maxHeight: 1320
                                                },
                                                required: ['url', 'quality'],
                                                properties: {
                                                    url: {
                                                        title: 'Hintergrundbild. BildService-ID *',
                                                        type: 'string',
                                                        minLength: 1
                                                    },
                                                    quality: {
                                                        title: 'Bildqualität',
                                                        format: 'range',
                                                        type: 'number',
                                                        minimum: 1,
                                                        maximum: 100,
                                                        default: 70
                                                    }
                                                }
                                            },
                                            mobile: {
                                                type: 'object',
                                                format: 'mediaImage',
                                                title: 'BildService-ID *',
                                                devicePixelRatio: 2,
                                                minWidth: 300,
                                                minHeight: 400,
                                                options: {
                                                    'max-height': '120px',
                                                    showTitle: false,
                                                    maxWidth: 750,
                                                    maxHeight: 750
                                                },
                                                required: ['url', 'quality'],
                                                properties: {
                                                    url: {
                                                        title: 'Alternatives Bild für mobiles Layout. BildService-ID',
                                                        type: 'string'
                                                    },
                                                    quality: {
                                                        title: 'Bildqualität',
                                                        format: 'range',
                                                        type: 'number',
                                                        minimum: 1,
                                                        maximum: 100,
                                                        default: 70
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    video: {
                                        type: 'object',
                                        required: ['url', 'type', 'loop'],
                                        options: {
                                            showTitle: false
                                        },
                                        properties: {
                                            url: {
                                                title: 'Hintergrundvideo. BildService-ID',
                                                description:
                                                    'Videos werden nur auf Desktop Rechnern abgespielt. Mobil wird nur das Bild angezeigt',
                                                type: 'string',
                                                format: 'mediaVideo'
                                            },
                                            loop: {
                                                title: 'Loop Video',
                                                format: 'checkbox',
                                                type: 'boolean',
                                                default: true
                                            },
                                            type: {
                                                title: 'Medientyp',
                                                type: 'string',
                                                default: 'video',
                                                options: {
                                                    hidden: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        id: 'typingModule',
                        type: 'object',
                        title: 'Tip-Animation',
                        additionalProperties: false,
                        required: ['partial', 'typing'],
                        properties: {
                            partial: {
                                type: 'string',
                                options: {
                                    hidden: true
                                },
                                default: 'app/src/modules/typing/typing',
                                pattern: '^app/src/modules/typing/typing'
                            },
                            typing: {
                                type: 'object',
                                required: ['headline', 'content', 'position'],
                                additionalProperties: false,
                                options: {
                                    showTitle: false
                                },
                                properties: {
                                    headline: {
                                        title: 'Dachzeile',
                                        type: 'string'
                                    },
                                    content: {
                                        title: 'Text',
                                        type: 'string'
                                    },
                                    position: {
                                        title: 'Positionierung',
                                        type: 'string',
                                        enum: ['center', 'left', 'right'],
                                        options: {
                                            enumTitles: ['Zentriert', 'Nach links versetzt', 'Nach rechts versetzt']
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        id: 'popinModule',
                        type: 'object',
                        title: 'Aufklappbild',
                        additionalProperties: false,
                        required: ['partial', 'popin'],
                        options: {
                            disable_collapse: true
                        },
                        properties: {
                            partial: {
                                type: 'string',
                                options: {
                                    hidden: true
                                },
                                default: 'app/src/modules/popin/popin',
                                pattern: '^app/src/modules/popin/popin'
                            },
                            popin: {
                                type: 'object',
                                require: ['content', 'image', 'caption', 'source'],
                                additionalProperties: false,
                                options: {
                                    showTitle: false
                                },
                                properties: {
                                    withInitial: {
                                        title: 'Text beginnt mit einer Initiale',
                                        type: 'boolean',
                                        default: false,
                                        format: 'checkbox'
                                    },
                                    content: {
                                        title: 'Text',
                                        type: 'string',
                                        format: 'html',
                                        options: {
                                            mediumEditor: {
                                                buttons: [
                                                    {
                                                        name: 'underline',
                                                        action: 'underline',
                                                        tagNames: ['u'],
                                                        contentDefault: '<b>Bildschalter</b>'
                                                    },
                                                    'h2',
                                                    'bold',
                                                    'italic',
                                                    'anchor'
                                                ]
                                            }
                                        }
                                    },
                                    image: {
                                        type: 'object',
                                        required: ['desktop', 'mobile'],
                                        properties: {
                                            desktop: {
                                                type: 'object',
                                                required: ['url', 'quality'],
                                                options: {
                                                    'max-height': '250px',
                                                    maxWidth: 1320,
                                                    maxHeight: 1320
                                                },
                                                format: 'mediaImage',
                                                devicePixelRatio: 2,
                                                minWidth: 320,
                                                minHeight: 320,
                                                properties: {
                                                    url: {
                                                        title: 'Das verlinkte Bild. BildService-ID *',
                                                        type: 'string',
                                                        minLength: 1
                                                    },
                                                    quality: {
                                                        title: 'Bildqualität',
                                                        format: 'range',
                                                        type: 'number',
                                                        minimum: 1,
                                                        maximum: 100,
                                                        default: 70
                                                    }
                                                }
                                            },
                                            mobile: {
                                                type: 'object',
                                                required: ['url', 'quality'],
                                                options: {
                                                    'max-height': '120px',
                                                    maxWidth: 750,
                                                    maxHeight: 750
                                                },
                                                format: 'mediaImage',
                                                devicePixelRatio: 2,
                                                minWidth: 320,
                                                minHeight: 320,
                                                properties: {
                                                    url: {
                                                        title: 'Alternatives Bild für mobiles Layout. BildService-ID',
                                                        type: 'string',
                                                        minLength: 1
                                                    },
                                                    quality: {
                                                        title: 'Bildqualität',
                                                        format: 'range',
                                                        type: 'number',
                                                        minimum: 1,
                                                        maximum: 100,
                                                        default: 70
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    caption: {
                                        title: 'Bildunterschrift',
                                        type: 'string'
                                    },
                                    source: {
                                        title: 'Quellenangabe',
                                        type: 'string',
                                        description:
                                            'Wird aus BildService automatisch befüllt wenn nichts angegeben wurde.'
                                    }
                                }
                            }
                        }
                    },
                    {
                        id: 'videoModule',
                        type: 'object',
                        title: 'Video Modul',
                        additionalProperties: false,
                        required: ['partial', 'video'],
                        properties: {
                            partial: {
                                type: 'string',
                                options: {
                                    hidden: true
                                },
                                default: 'app/src/modules/video/video',
                                pattern: '^app/src/modules/video/video'
                            },
                            video: {
                                title: 'videosettings',
                                type: 'object',
                                required: ['url', 'source', 'type', 'previewImage', 'autoplay', 'displayMode'],
                                options: {
                                    showTitle: false
                                },
                                properties: {
                                    url: {
                                        title: 'Video-URL als BildService-ID',
                                        type: 'string',
                                        format: 'mediaVideo'
                                    },
                                    previewImage: {
                                        title: 'Vorschaubild',
                                        type: 'object',
                                        required: ['url', 'quality'],
                                        options: {
                                            showTitle: false,
                                            'max-height': '120px',
                                            maxWidth: 750,
                                            maxHeight: 750
                                        },
                                        format: 'mediaImage',
                                        devicePixelRatio: 2,
                                        minWidth: 320,
                                        minHeight: 320,
                                        properties: {
                                            url: {
                                                title: 'Vorschaubild-URL als BildService-ID *',
                                                description:
                                                    'Vorschaubild für den Video-Player. Dieses Feld muss nur ausgefüllt werden wenn nicht das für das Video hinterlegte Vorschaubild aus BildService verwendet werden soll. Erwartet wird eine BildService-ID.',
                                                type: 'string',
                                                minLength: 1
                                            },
                                            quality: {
                                                title: 'Bildqualität',
                                                format: 'range',
                                                type: 'number',
                                                minimum: 0,
                                                maximum: 100,
                                                default: 70
                                            }
                                        }
                                    },
                                    source: {
                                        title: 'Quellenangabe',
                                        type: 'string',
                                        description:
                                            'Wird aus BildService automatisch befüllt wenn nichts angegeben wurde.'
                                    },
                                    autoplay: {
                                        title: 'Autoplay',
                                        type: 'boolean',
                                        format: 'checkbox',
                                        description:
                                            'Wenn diese Option aktiviert ist, wird das Video automatisch abgespielt sobald der Leser an die entsprechende Stelle im Artikel scrollt',
                                        default: 'true'
                                    },
                                    displayMode: {
                                        title: 'Anzeigemodus',
                                        description:
                                            'Legt fest, ob der nachfolgende Text um das Bild fließen soll oder ob das Bild die ganze Spaltenbreite einnimmt. Auf kleinen Bildschirmen wird das Bild jedoch immer vollbreit angezeigt.',
                                        type: 'string',
                                        default: 'expanded',
                                        enum: ['float-left', 'float-right', 'text-wide', 'expanded', 'fullwidth'],
                                        options: {
                                            enumTitles: [
                                                'Video links',
                                                'Video rechts',
                                                'Textbreit',
                                                'Überbreit',
                                                'Vollbreit'
                                            ]
                                        }
                                    },
                                    type: {
                                        title: 'Medientyp',
                                        type: 'string',
                                        default: 'video',
                                        options: {
                                            hidden: true
                                        }
                                    },
                                    quality: {
                                        type: 'number'
                                    }
                                }
                            }
                        }
                    },
                    {
                        type: 'object',
                        title: 'Sprungmarke',
                        additionalProperties: false,
                        required: ['partial', 'target'],
                        options: {
                            disable_collapse: true
                        },
                        properties: {
                            partial: {
                                type: 'string',
                                options: {
                                    hidden: true
                                },
                                default: 'app/src/modules/target/target',
                                pattern: '^app/src/modules/target/target'
                            },
                            target: {
                                type: 'string',
                                title: 'Name',
                                description:
                                    'Ein eindeutiger Name für die Sprungmarke. Die Sprunkmarke kann durch anfügen von #Name in der Url aufgerufen werden. Z.B. http://...9234/www/#kapitel2',
                                minLength: 1
                            }
                        }
                    },
                    {
                        id: 'embedModule',
                        type: 'object',
                        title: 'Embed-Script',
                        additionalProperties: false,
                        required: ['partial', 'embed'],
                        options: {
                            disable_collapse: true
                        },
                        properties: {
                            partial: {
                                type: 'string',
                                options: {
                                    hidden: true
                                },
                                default: 'app/src/modules/embed/embed',
                                pattern: '^app/src/modules/embed/embed'
                            },
                            embed: {
                                title: 'Embed-Script',
                                type: 'object',
                                required: ['url', 'config', 'channel'],
                                properties: {
                                    url: {
                                        title: 'URL zu dem Embed-Script.',
                                        type: 'string',
                                        description:
                                            'embed.js wird automatisch hinzugefügt. Eingabe z.B. http://image.company.de/apps/5820c8ccf38f33fb247b5c4c/map-elector/'
                                    },
                                    config: {
                                        title: 'Optionale Einstellungen',
                                        description:
                                            "Pseudo JSON-Objekt in der Form { withTitle: false, initialHeight: '512px' }. Wichtig: es dürfen keine doppelten Anführungszeichen (\") verwendet werden",
                                        type: 'string'
                                    },
                                    channel: {
                                        title: 'Channel',
                                        type: 'string',
                                        enum: ['www', 'mobile', 'tablet'],
                                        options: {
                                            hidden: true
                                        },
                                        default: 'www'
                                    }
                                }
                            }
                        }
                    },
                    {
                        id: 'counterModule',
                        type: 'object',
                        title: 'Kontinuierlicher Hochzähler',
                        additionalProperties: false,
                        required: ['partial', 'counter'],
                        options: {
                            disable_collapse: true
                        },
                        properties: {
                            partial: {
                                type: 'string',
                                options: {
                                    hidden: true
                                },
                                default: 'app/src/modules/counter/counter',
                                pattern: '^app/src/modules/counter/counter'
                            },
                            counter: {
                                type: 'object',
                                required: ['rate', 'intro', 'outro'],
                                properties: {
                                    rate: {
                                        title: 'Rate',
                                        description: 'Anzahl pro Minute',
                                        type: 'number',
                                        default: 51312
                                    },
                                    throttle: {
                                        title: 'Aktualisierungen minimieren',
                                        description:
                                            'Aktualisiert den Hochzähler nur falls der Unterschied höher als die angegebene Zahl ist',
                                        type: 'number',
                                        default: 0
                                    },
                                    intro: {
                                        title: 'Text vor dem kontinuierlichen Hochzähler',
                                        format: 'html',
                                        type: 'string'
                                    },
                                    outro: {
                                        title: 'Text nach dem kontinuierlichen Hochzähler',
                                        type: 'string',
                                        format: 'html'
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        furtherReading: {
            title: 'Weitere Artikel',
            type: 'array',
            // @ts-ignore
            options: {
                editor: 'MasterDetail',
                header: {
                    inverted: true
                }
            },
            items: {
                type: 'object',
                title: 'Artikel',
                required: ['kicker', 'headline', 'link', 'image'],
                options: {
                    previewValue: 'headline'
                },
                properties: {
                    image: {
                        type: 'object',
                        required: ['url', 'quality'],
                        format: 'mediaImage',
                        options: {
                            showTitle: false,
                            maxWidth: 1320,
                            maxHeight: 1320
                        },
                        devicePixelRatio: 2,
                        minWidth: 320,
                        minHeight: 200,
                        properties: {
                            type: {
                                type: 'string',
                                const: 'image'
                            },
                            url: {
                                title: 'Bild-URL *',
                                description: 'Erwartet wird eine BildService ID',
                                minLength: 1,
                                type: 'string'
                            },
                            quality: {
                                format: 'range',
                                type: 'number',
                                minimum: 1,
                                maximum: 100,
                                default: 70
                            }
                        }
                    },
                    kicker: {
                        title: 'Dachzeile *',
                        type: 'string',
                        minLength: 1
                    },
                    headline: {
                        title: 'Überschrift *',
                        type: 'string',
                        minLength: 1
                    },
                    link: {
                        title: 'Link *',
                        type: 'string',
                        minLength: 1
                    }
                }
            }
        },
        credits: {
            type: 'array',
            title: 'Credits',
            options: {
                collapsed: true
            },
            items: {
                type: 'object',
                required: ['what', 'who'],
                additionalProperties: false,
                properties: {
                    what: {
                        title: 'Titel',
                        type: 'string'
                    },
                    who: {
                        title: 'Personen',
                        type: 'string'
                    }
                }
            }
        },
        seo: {
            title: 'SEO',
            type: 'object',
            required: ['title', 'teaser', 'keywords', 'schemaOrg'],
            options: {
                collapsed: true
            },
            properties: {
                title: {
                    title: 'Seitentitel',
                    type: 'string',
                    description:
                        'Erscheint oben im Browser-Tab und wird häufig als Überschrift in den Suchergebnissen verwendet. Der Titel hat einen großen Einfluss auf das Ranking. Empfohlen ist eine Länge von 55 Zeichen.'
                },
                teaser: {
                    title: 'Teaser',
                    type: 'string',
                    format: 'textarea',
                    maxLength: 155,
                    description:
                        'Wird oft als Kurzfassung unter den Suchergebnissen angezeigt. Der Teaser hat ebenfalls einen großen Einfluss auf das Ranking. Der Zeichenanzahl ist auf 155 beschränkt, da Google darüber hinaus den Teaser abbricht oder u.U. nicht verwendet.'
                },
                keywords: {
                    title: 'Schlagwörter',
                    type: 'string',
                    default: '',
                    description:
                        'Getrennt durch Kommata. Hat auf das Ranking wenig Einfluss, wird aber zum Beispiel von Google News verwendet, um den Artikel einem Themenkomplex zuzuordnen.'
                },
                schemaOrg: {
                    title: 'Schema.org Informationen',
                    description: 'Schema.org Metatags z.B. für Google',
                    type: 'object',
                    required: ['title', 'description', 'image', 'logo'],
                    properties: {
                        title: {
                            title: 'Titel',
                            type: 'string'
                        },
                        description: {
                            title: 'Beschreibungstext',
                            type: 'string'
                        },
                        image: {
                            type: 'object',
                            required: ['url', 'quality'],
                            options: {
                                showTitle: false,
                                'max-height': '150px',
                                maxWidth: 600,
                                maxHeight: 600
                            },
                            format: 'mediaImage',
                            devicePixelRatio: 2,
                            minWidth: 600,
                            minHeight: 600,
                            properties: {
                                url: {
                                    title: 'Vorschaubild',
                                    type: 'string',
                                    description: 'Teaserbild als BildService-Id'
                                },
                                quality: {
                                    title: 'Bildqualität',
                                    format: 'range',
                                    type: 'number',
                                    minimum: 1,
                                    maximum: 100,
                                    default: 70
                                }
                            }
                        },
                        logo: {
                            type: 'string',
                            default: 'style/lib/assets/small-black.png',
                            options: {
                                hidden: true
                            }
                        }
                    }
                }
            }
        },
        socialMedia: {
            title: 'Social Media',
            type: 'object',
            required: ['email', 'facebook', 'twitter', 'whatsapp'],
            options: {
                collapsed: true
            },
            properties: {
                email: {
                    title: 'E-mail',
                    type: 'object',
                    required: ['sharingSubject', 'sharingBody'],
                    options: {
                        disable_collapse: true
                    },
                    properties: {
                        sharingSubject: {
                            title: 'Betreff',
                            type: 'string'
                        },
                        sharingBody: {
                            title: 'Nachricht',
                            type: 'string',
                            format: 'textarea',
                            description: 'Der Platzhalter {{url}} wird durch die URL des Artikels ersetzt.'
                        }
                    }
                },
                facebook: {
                    title: 'Facebook',
                    type: 'object',
                    description: 'Diese Informationen werden in einer Box unter dem Post angezeigt.',
                    required: ['title', 'description', 'image'],
                    options: {
                        disable_collapse: true
                    },
                    properties: {
                        title: {
                            title: 'Überschrift',
                            type: 'string'
                        },
                        description: {
                            title: 'Kurzfassung',
                            type: 'string',
                            format: 'textarea'
                        },
                        image: {
                            type: 'object',
                            required: ['url', 'quality'],
                            options: {
                                showTitle: false,
                                'max-height': '150px',
                                maxWidth: 600,
                                maxHeight: 600
                            },
                            format: 'mediaImage',
                            devicePixelRatio: 2,
                            minWidth: 600,
                            minHeight: 600,
                            properties: {
                                url: {
                                    title: 'Vorschaubild',
                                    type: 'string',
                                    description: 'Teaserbild als BildService-Id'
                                },
                                quality: {
                                    title: 'Bildqualität',
                                    format: 'range',
                                    type: 'number',
                                    minimum: 1,
                                    maximum: 100,
                                    default: 70
                                }
                            }
                        }
                    }
                },
                twitter: {
                    title: 'Twitter',
                    type: 'object',
                    description: 'Diese Informationen werden als kleines Kärtchen unter dem Tweet angezeigt.',
                    required: ['title', 'description', 'image', 'sharingText'],
                    options: {
                        disable_collapse: true
                    },
                    properties: {
                        title: {
                            title: 'Überschrift',
                            type: 'string'
                        },
                        description: {
                            title: 'Kurzfassung',
                            type: 'string',
                            format: 'textarea'
                        },
                        image: {
                            type: 'object',
                            required: ['url', 'quality'],
                            options: {
                                showTitle: false,
                                'max-height': '150px',
                                maxWidth: 600,
                                maxHeight: 600
                            },
                            format: 'mediaImage',
                            devicePixelRatio: 2,
                            minWidth: 600,
                            minHeight: 600,
                            properties: {
                                url: {
                                    title: 'Vorschaubild',
                                    type: 'string',
                                    description: 'Teaserbild als BildService-Id'
                                },
                                quality: {
                                    title: 'Bildqualität',
                                    format: 'range',
                                    type: 'number',
                                    minimum: 1,
                                    maximum: 100,
                                    default: 70
                                }
                            }
                        },
                        sharingText: {
                            title: 'Tweet',
                            type: 'string',
                            format: 'textarea',
                            description:
                                'Die URL des Artikels wird automatisch an den Tweet-Text angehängt. Hashtags dürfen keine Leer- oder Sonderzeichen enthalten und müssen mit einem Buchstaben beginnen.',
                            maxLength: 116
                        }
                    }
                },
                whatsapp: {
                    title: 'Whatsapp',
                    type: 'object',
                    required: ['sharingText'],
                    options: {
                        disable_collapse: true
                    },
                    properties: {
                        sharingText: {
                            title: 'Nachricht',
                            type: 'string',
                            format: 'textarea',
                            description: 'Der Platzhalter {{url}} wird durch die URL des Artikels ersetzt.'
                        }
                    }
                }
            }
        },
        dev: {
            title: 'Entwickleroptionen',
            type: 'object',
            required: ['customCSS'],
            properties: {
                customCSS: {
                    title: 'Benutzerdefiniertes CSS',
                    type: 'string',
                    format: 'textarea'
                }
            }
        }
    }
};

export const data = {
    header: {
        theme: 'dark',
        datePublished: '2016-01-01 08:00'
    },
    intro: {
        title: 'Vergiftete Versprechen',
        caption: 'Why is this required?',
        subtitle:
            '<p>Marinduque leidet unter dem giftigen Erbe des schwersten Industrieunglücks in der Geschichte der Philippinen. Seit zwanzig Jahren kämpft die kleine Insel gegen einen der größten Bergbaukonzerne der Welt.</p>',
        author: '',
        yAlign: 'bottom',
        displayMode: 'parallax',
        image: {
            desktop: {
                url: 'data/assets/intro.jpg',
                quality: 70
            },
            mobile: {
                url: 'data/assets/introMobile.jpg',
                quality: 70
            }
        },
        video: {
            url: 'http://example.com/wissen/2015-11-27_Marshallinseln/assets/chapter01/loop-lagune.mp4',
            type: 'video',
            loop: true
        }
    },
    modules: [
        {
            partial: 'app/src/modules/text/text',
            text: {
                withInitial: false,
                content:
                    '<p>Zuerst war es nur eine unscheinbare Wunde, wie sie sich die Fischer hier ständig zuziehen, wenn sie über die scharfkantigen Korallenfelsen zu ihren Booten klettern oder die Nylonfäden beim Einholen der Netze in ihre Hände schneiden. Doch die Wunde an Wilson Manubas rechtem Fuß fraß sich tiefer und tiefer in sein Fleisch. Die Salben aus der Klinik halfen nicht. Sein Bein schmolz, sagt Manuba, wie Kerzenwachs. Die Wunde entzündete sich, bis die Infektion seinen ganzen Körper bedrohte. Die Ärzte mussten das Bein amputieren, um Manubas Leben zu retten.</p>'
            }
        },
        {
            partial: 'app/src/modules/video/video',
            video: {
                url: 'http://example.com/assets/videos/831efdfa02e706d5b124b49fcea0d755172db876c6e7fdd4f79d70893fcf644cc9b17857eb6fd163265257a4ca2db073c6c07fa235399a2f5e716c7479b5da78.mp4',
                previewImage: {
                    url: 'data/assets/video_dergipfel.png',
                    quality: 70
                },
                source: 'DPA',
                autoplay: true,
                type: 'video',
                displayMode: 'float-left'
            }
        },
        {
            partial: 'app/src/modules/text/text',
            text: {
                withInitial: false,
                content:
                    "<p><b>Alorem ipsum dolor sit amet, consectetur <a href='#'>adipiscing</a> elit.</b> Cur igitur, inquam, res tam dissimiles eodem nomine appellas? Iis igitur est difficilius satis facere, qui se Latina scripta dicunt contemnere. Duo Reges: constructio interrete. Quae si potest singula consolando levare, universa quo modo sustinebit? Ita relinquet duas, de quibus etiam atque etiam consideret.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cur igitur, inquam, res tam dissimiles eodem nomine appellas? Iis igitur est difficilius satis facere, qui se Latina scripta dicunt contemnere. Duo Reges: constructio interrete. Quae si potest singula consolando levare, universa quo modo sustinebit? Ita relinquet duas, de quibus etiam atque etiam consideret.</p>"
            }
        },
        {
            partial: 'app/src/modules/video/video',
            video: {
                url: 'http://example.com/assets/videos/3fe4cf92b10879203675eebe582d2a0ec5e38dcd369149b63074f1b1ba54bdef7c866897ad9fa59102f775e555bcfc5af998a827dcde3a4708a1821e4553184f.mp4',
                previewImage: {
                    url: 'data/assets/video_dergipfel.png',
                    quality: 70
                },
                source: 'DPA',
                autoplay: true,
                type: 'video',
                displayMode: 'float-left'
            }
        },
        {
            partial: 'app/src/modules/image/image',
            image: {
                desktop: {
                    url: 'data/assets/animated_map.gif',
                    quality: 70
                },
                mobile: {
                    url: 'data/assets/animated_map.gif',
                    quality: 70
                },
                caption: 'Animiertes GIF, das immer wieder neu startet. Toll, oder?',
                source: 'Selbst gemacht',
                displayMode: 'expanded',
                animated: {
                    resetOnVisible: true
                }
            }
        },
        {
            partial: 'app/src/modules/text/text',
            text: {
                withInitial: false,
                content:
                    "<p><b>Alorem ipsum dolor sit amet, consectetur <a href='#'>adipiscing</a> elit.</b> Cur igitur, inquam, res tam dissimiles eodem nomine appellas? Iis igitur est difficilius satis facere, qui se Latina scripta dicunt contemnere. Duo Reges: constructio interrete. Quae si potest singula consolando levare, universa quo modo sustinebit? Ita relinquet duas, de quibus etiam atque etiam consideret.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cur igitur, inquam, res tam dissimiles eodem nomine appellas? Iis igitur est difficilius satis facere, qui se Latina scripta dicunt contemnere. Duo Reges: constructio interrete. Quae si potest singula consolando levare, universa quo modo sustinebit? Ita relinquet duas, de quibus etiam atque etiam consideret.</p>"
            }
        },
        {
            partial: 'app/src/modules/counter/counter',
            counter: {
                intro: '<p>Jetzt kommt der <b>kontinuierliche Hochzähler</b>...</p>',
                rate: 1672124,
                throttle: 20000,
                outro: '<p>WOW. Seitdem sie hier auf der Seite sind wurde diese Zahl mit 1672124 Zahlen pro Minute berechnet</p>'
            }
        },
        {
            partial: 'app/src/modules/typing/typing',
            typing: {
                position: 'left',
                headline: '12.04.2012 - Absender: Peter Lorem',
                content:
                    'Griaß God beinand aba schoo, luja gscheit a Hoiwe an Namidog. Sog i luja hod oa, Broadwurschtbudn gfreit mi nois. Hogg di hera und kummd, a geh.'
            }
        },
        {
            partial: 'app/src/modules/typing/typing',
            typing: {
                position: 'right',
                headline: '12.04.2012 - Empfänger: Huber Ipsum',
                content:
                    'Zwoa, gsuffa Hetschapfah da Kini Ohrwaschl scheans Sauakraud. Schoo heitzdog geh, auf der Oim, da gibt’s koa Sünd!'
            }
        },
        {
            partial: 'app/src/modules/typing/typing',
            typing: {
                position: 'left',
                headline: '12.04.2012 - Absender: Peter Lorem',
                content: 'Broadwurschtbudn gfreit mi nois. Hogg di hera und kummd, a geh.'
            }
        },
        {
            partial: 'app/src/modules/typing/typing',
            typing: {
                position: 'right',
                headline: '12.04.2012 - Empfänger: Huber Ipsum',
                content:
                    'Alorem ipsum dolor sit amet, consectetur adipiscing elit. Cur igitur, inquam, res tam dissimiles '
            }
        },
        {
            partial: 'app/src/modules/popin/popin',
            popin: {
                content:
                    '<p>&quot;Noch immer sterben Menschen an Hunger oder frieren zu Tode&quot;, sagt die UNHCR-Sprecherin - weil das Regime in Syrien und in geringerem Umfang auch Rebellen humanitäre Hilfe blockierten. Aber auch in den wichtigsten Aufnahmeländern, der Türkei, <a href="http://example.com/thema/Libanon" target="_blank">Libanon</a> und Jordanien, <u>habe die Unterfinanzierung schlimme Folgen.</u></p>',
                image: {
                    desktop: {
                        url: 'data/assets/erbgang04.jpg',
                        quality: 70
                    },
                    mobile: {
                        url: 'data/assets/erbgang03.jpg',
                        quality: 70
                    }
                },
                caption: '',
                source: '',
                withInitial: false
            }
        },
        {
            partial: 'app/src/modules/text/text',
            text: {
                withInitial: false,
                content:
                    "<h2>Duo Reges: Lorem ipsum dolor sit amet, <a href='#'>consectetur adipiscing</a> elit.</h2><p>Cur igitur, inquam, res tam dissimiles eodem nomine appellas? Iis igitur est difficilius satis facere, qui se Latina scripta dicunt contemnere. Duo Reges: constructio interrete. Quae si potest singula consolando levare, universa quo modo sustinebit? Ita relinquet duas, de quibus etiam atque etiam consideret.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><h3>Cur igitur</h3><p>inquam, res tam dissimiles eodem nomine appellas? Iis igitur est difficilius satis facere, qui se Latina scripta dicunt contemnere. Duo Reges: constructio interrete. Quae si potest singula consolando levare, universa quo modo sustinebit? Ita relinquet duas, de quibus etiam atque etiam consideret.</p>"
            }
        },
        {
            partial: 'app/src/modules/embed/embed',
            embed: {
                url: 'http://example.com/apps/5820c8ccf38f33fb247b5c4c/CURRENT/map-elector/',
                config: '{horizontalPadding: false}',
                channel: 'www'
            }
        },
        {
            partial: 'app/src/modules/text/text',
            text: {
                withInitial: false,
                content:
                    "<h2>Duo Reges: Lorem ipsum dolor sit amet, <a href='#'>consectetur adipiscing</a> elit.</h2><p>Cur igitur, inquam, res tam dissimiles eodem nomine appellas? Iis igitur est difficilius satis facere, qui se Latina scripta dicunt contemnere. Duo Reges: constructio interrete. Quae si potest singula consolando levare, universa quo modo sustinebit? Ita relinquet duas, de quibus etiam atque etiam consideret.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><h3>Cur igitur</h3><p>inquam, res tam dissimiles eodem nomine appellas? Iis igitur est difficilius satis facere, qui se Latina scripta dicunt contemnere. Duo Reges: constructio interrete. Quae si potest singula consolando levare, universa quo modo sustinebit? Ita relinquet duas, de quibus etiam atque etiam consideret.</p>"
            }
        },
        {
            partial: 'app/src/modules/parallax/parallax',
            parallax: {
                title: 'Ich bin eine Überschrift für den nächsten Abschnitt',
                caption: 'a dummy caption',
                image: {
                    desktop: {
                        url: 'data/assets/ocean_2x768x511.jpg',
                        quality: 70
                    },
                    mobile: {
                        url: 'data/assets/animated_map.gif',
                        quality: 70
                    }
                },
                video: {
                    url: 'http://www.vidsplay.com/vids/shower.mp4',
                    type: 'video',
                    loop: true
                }
            }
        },
        {
            partial: 'app/src/modules/text/text',
            text: {
                withInitial: false,
                content:
                    '<h2>Duo Reges:</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cur igitur, inquam, res tam dissimiles eodem nomine appellas? Iis igitur est difficilius satis facere, qui se Latina scripta dicunt contemnere. Duo Reges: constructio interrete. Quae si potest singula consolando levare, universa quo modo sustinebit? Ita relinquet duas, de quibus etiam atque etiam consideret.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><h3>Cur igitur</h3><p>inquam, res tam dissimiles eodem nomine appellas? Iis igitur est difficilius satis facere, qui se Latina scripta dicunt contemnere. Duo Reges: constructio interrete. Quae si potest singula consolando levare, universa quo modo sustinebit? Ita relinquet duas, de quibus etiam atque etiam consideret.</p>'
            }
        },
        {
            theme: 'light',
            partial: 'app/src/modules/blender/imageBlender',
            slides: {
                displayMode: 'cover',
                default: [
                    {
                        desktop: {
                            url: 'data/assets/largeToSmall.png',
                            quality: 70
                        },
                        mobile: {
                            url: 'data/assets/smallToLarge.png',
                            quality: 70
                        }
                    },
                    {
                        desktop: {
                            url: 'data/assets/desktopOnly.png',
                            quality: 70
                        },
                        mobile: {
                            url: 'data/assets/smallToLarge.png',
                            quality: 1
                        }
                    }
                ],
                fallback: [
                    {
                        image: {
                            url: 'data/assets/mobileOnly.png',
                            quality: 70
                        }
                    },
                    {
                        image: {
                            url: 'data/assets/noChange.png',
                            quality: 70
                        }
                    }
                ]
            }
        },
        {
            partial: 'app/src/modules/text/text',
            text: {
                withInitial: true,
                content:
                    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cur igitur, inquam, res tam dissimiles eodem nomine appellas? Iis igitur est difficilius satis facere, qui se Latina scripta dicunt contemnere. Duo Reges: constructio interrete. Quae si potest singula consolando levare, universa quo modo sustinebit? Ita relinquet duas, de quibus etiam atque etiam consideret.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cur igitur, inquam, res tam dissimiles eodem nomine appellas? Iis igitur est difficilius satis facere, qui se Latina scripta dicunt contemnere. Duo Reges: constructio interrete. Quae si potest singula consolando levare, universa quo modo sustinebit? Ita relinquet duas, de quibus etiam atque etiam consideret.</p>'
            }
        },
        {
            partial: 'app/src/modules/image/image',
            image: {
                desktop: {
                    url: 'data/assets/animation.gif',
                    quality: 70
                },
                mobile: {
                    url: 'data/assets/portrait.jpg',
                    quality: 70
                },
                caption: 'Hier sieht man ein floatendes, responsives Bild. Toll, oder?',
                source: 'Selbst gemacht',
                displayMode: 'float-right',
                animated: {
                    resetOnVisible: true
                }
            }
        },
        {
            partial: 'app/src/modules/text/text',
            text: {
                withInitial: false,
                content:
                    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. An nisi populari fama? Eorum enim est haec querela, qui sibi cari sunt seseque diligunt. Apud ceteros autem philosophos, qui quaesivit aliquid, tacet; Duo Reges: constructio interrete. Qui autem esse poteris, nisi te amor ipse ceperit? Is ita vivebat, ut nulla tam exquisita posset inveniri voluptas, qua non abundaret. Sed tamen intellego quid velit. Quo modo autem optimum, si bonum praeterea nullum est? Quoniam, si dis placet, ab Epicuro loqui discimus. In his igitur partibus duabus nihil erat, quod Zeno commutare gestiret. Quarum ambarum rerum cum medicinam pollicetur, luxuriae licentiam pollicetur. Haec quo modo conveniant, non sane intellego.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. An nisi populari fama? Eorum enim est haec querela, qui sibi cari sunt seseque diligunt. Apud ceteros autem philosophos, qui quaesivit aliquid, tacet; Duo Reges: constructio interrete. Qui autem esse poteris, nisi te amor ipse ceperit? Is ita vivebat, ut nulla tam exquisita posset inveniri voluptas, qua non abundaret. Sed tamen intellego quid velit. Quo modo autem optimum, si bonum praeterea nullum est? Quoniam, si dis placet, ab Epicuro loqui discimus. In his igitur partibus duabus nihil erat, quod Zeno commutare gestiret. Quarum ambarum rerum cum medicinam pollicetur, luxuriae licentiam pollicetur. Haec quo modo conveniant, non sane intellego.</p>'
            }
        },
        {
            partial: 'app/src/modules/image/image',
            image: {
                desktop: {
                    url: 'data/assets/landscape.jpg',
                    quality: 70
                },
                mobile: {
                    url: 'data/assets/animated_map.gif',
                    quality: 1
                },
                caption: 'Das hier ist nicht so responsive. Muss ja nicht immer sein.',
                source: 'Auch selbst gemacht',
                displayMode: 'text-wide',
                animated: {
                    resetOnVisible: false
                }
            }
        },
        {
            partial: 'app/src/modules/target/target',
            target: 'kapitel2'
        },
        {
            partial: 'app/src/modules/text/text',
            text: {
                withInitial: false,
                content:
                    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. An nisi populari fama? Eorum enim est haec querela, qui sibi cari sunt seseque diligunt. Apud ceteros autem philosophos, qui quaesivit aliquid, tacet; Duo Reges: constructio interrete. Qui autem esse poteris, nisi te amor ipse ceperit? Is ita vivebat, ut nulla tam exquisita posset inveniri voluptas, qua non abundaret. Sed tamen intellego quid velit. Quo modo autem optimum, si bonum praeterea nullum est? Quoniam, si dis placet, ab Epicuro loqui discimus. In his igitur partibus duabus nihil erat, quod Zeno commutare gestiret. Quarum ambarum rerum cum medicinam pollicetur, luxuriae licentiam pollicetur. Haec quo modo conveniant, non sane intellego.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. An nisi populari fama? Eorum enim est haec querela, qui sibi cari sunt seseque diligunt. Apud ceteros autem philosophos, qui quaesivit aliquid, tacet; Duo Reges: constructio interrete. Qui autem esse poteris, nisi te amor ipse ceperit? Is ita vivebat, ut nulla tam exquisita posset inveniri voluptas, qua non abundaret. Sed tamen intellego quid velit. Quo modo autem optimum, si bonum praeterea nullum est? Quoniam, si dis placet, ab Epicuro loqui discimus. In his igitur partibus duabus nihil erat, quod Zeno commutare gestiret. Quarum ambarum rerum cum medicinam pollicetur, luxuriae licentiam pollicetur. Haec quo modo conveniant, non sane intellego.</p>'
            }
        },
        {
            partial: 'app/src/modules/image/image',
            image: {
                caption: 'Hier ein richtig überbreites Bild.',
                source: 'YO',
                displayMode: 'expanded',
                animated: {
                    resetOnVisible: false
                },

                desktop: {
                    url: 'data/assets/landscape.jpg',
                    quality: 70
                },
                mobile: {
                    url: 'data/assets/animated_map.gif',
                    quality: 1
                }
            }
        },
        {
            partial: 'app/src/modules/text/text',
            text: {
                withInitial: false,
                content:
                    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. An nisi populari fama? Eorum enim est haec querela, qui sibi cari sunt seseque diligunt. Apud ceteros autem philosophos, qui quaesivit aliquid, tacet; Duo Reges: constructio interrete. Qui autem esse poteris, nisi te amor ipse ceperit? Is ita vivebat, ut nulla tam exquisita posset inveniri voluptas, qua non abundaret. Sed tamen intellego quid velit. Quo modo autem optimum, si bonum praeterea nullum est? Quoniam, si dis placet, ab Epicuro loqui discimus. In his igitur partibus duabus nihil erat, quod Zeno commutare gestiret. Quarum ambarum rerum cum medicinam pollicetur, luxuriae licentiam pollicetur. Haec quo modo conveniant, non sane intellego.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. An nisi populari fama? Eorum enim est haec querela, qui sibi cari sunt seseque diligunt. Apud ceteros autem philosophos, qui quaesivit aliquid, tacet; Duo Reges: constructio interrete. Qui autem esse poteris, nisi te amor ipse ceperit? Is ita vivebat, ut nulla tam exquisita posset inveniri voluptas, qua non abundaret. Sed tamen intellego quid velit. Quo modo autem optimum, si bonum praeterea nullum est? Quoniam, si dis placet, ab Epicuro loqui discimus. In his igitur partibus duabus nihil erat, quod Zeno commutare gestiret. Quarum ambarum rerum cum medicinam pollicetur, luxuriae licentiam pollicetur. Haec quo modo conveniant, non sane intellego.</p>'
            }
        },
        {
            partial: 'app/src/modules/image/image',
            image: {
                desktop: {
                    url: 'data/assets/landscape.jpg',
                    quality: 70
                },
                mobile: {
                    url: 'data/assets/animated_map.gif',
                    quality: 70
                },
                caption: 'Hier ein total überbreites Bild.',
                source: 'Das hier ist 1320px breit',
                displayMode: 'fullwidth',
                animated: {
                    resetOnVisible: false
                }
            }
        },
        {
            theme: 'light',
            partial: 'app/src/modules/blender/imageBlender',
            slides: {
                displayMode: 'contain',
                default: [
                    {
                        desktop: {
                            url: 'data/assets/blender01_03.png',
                            quality: 63
                        },
                        mobile: {
                            url: 'data/assets/animated_map.gif',
                            quality: 70
                        }
                    },
                    {
                        desktop: {
                            url: 'data/assets/blender02_03.png',
                            quality: 70
                        },
                        mobile: {
                            url: 'data/assets/animated_map.gif',
                            quality: 70
                        }
                    },
                    {
                        desktop: {
                            url: 'data/assets/blender03_03.png',
                            quality: 70
                        },
                        mobile: {
                            url: 'data/assets/animated_map.gif',
                            quality: 70
                        }
                    }
                ],
                fallback: [
                    {
                        image: {
                            url: 'data/assets/blender03.png',
                            quality: 70
                        }
                    }
                ]
            }
        },
        {
            partial: 'app/src/modules/text/text',
            text: {
                withInitial: false,
                content:
                    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. An nisi populari fama? Eorum enim est haec querela, qui sibi cari sunt seseque diligunt. Apud ceteros autem philosophos, qui quaesivit aliquid, tacet; Duo Reges: constructio interrete. Qui autem esse poteris, nisi te amor ipse ceperit? Is ita vivebat, ut nulla tam exquisita posset inveniri voluptas, qua non abundaret. Sed tamen intellego quid velit. Quo modo autem optimum, si bonum praeterea nullum est? Quoniam, si dis placet, ab Epicuro loqui discimus.</p>'
            }
        },
        {
            slides: {
                displayMode: 'contain',
                default: [
                    {
                        desktop: {
                            url: 'data/assets/blender01_04.png',
                            quality: 70
                        },
                        mobile: {
                            url: 'data/assets/animated_map.gif',
                            quality: 70
                        }
                    },
                    {
                        desktop: {
                            url: 'data/assets/blender02_04.png',
                            quality: 70
                        },
                        mobile: {
                            url: 'data/assets/animated_map.gif',
                            quality: 70
                        }
                    },
                    {
                        desktop: {
                            url: 'data/assets/blender03_04.png',
                            quality: 70
                        },
                        mobile: {
                            url: 'data/assets/animated_map.gif',
                            quality: 70
                        }
                    },
                    {
                        desktop: {
                            url: 'data/assets/blender04_04.png',
                            quality: 70
                        },
                        mobile: {
                            url: 'data/assets/animated_map.gif',
                            quality: 70
                        }
                    }
                ],
                fallback: [
                    {
                        image: {
                            url: 'data/assets/blender04.png',
                            quality: 70
                        }
                    }
                ]
            },
            theme: 'light',
            partial: 'app/src/modules/blender/imageBlender'
        },
        {
            partial: 'app/src/modules/text/text',
            text: {
                withInitial: false,
                content:
                    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. An nisi populari fama? Eorum enim est haec querela, qui sibi cari sunt seseque diligunt. Apud ceteros autem philosophos, qui quaesivit aliquid, tacet; Duo Reges: constructio interrete. Qui autem esse poteris, nisi te amor ipse ceperit? Is ita vivebat, ut nulla tam exquisita posset inveniri voluptas, qua non abundaret. Sed tamen intellego quid velit. Quo modo autem optimum, si bonum praeterea nullum est? Quoniam, si dis placet, ab Epicuro loqui discimus. In his igitur partibus duabus nihil erat, quod Zeno commutare gestiret. Quarum ambarum rerum cum medicinam pollicetur, luxuriae licentiam pollicetur. Haec quo modo conveniant, non sane intellego.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. An nisi populari fama? Eorum enim est haec querela, qui sibi cari sunt seseque diligunt. Apud ceteros autem philosophos, qui quaesivit aliquid, tacet; Duo Reges: constructio interrete. Qui autem esse poteris, nisi te amor ipse ceperit? Is ita vivebat, ut nulla tam exquisita posset inveniri voluptas, qua non abundaret. Sed tamen intellego quid velit. Quo modo autem optimum, si bonum praeterea nullum est? Quoniam, si dis placet, ab Epicuro loqui discimus. In his igitur partibus duabus nihil erat, quod Zeno commutare gestiret. Quarum ambarum rerum cum medicinam pollicetur, luxuriae licentiam pollicetur. Haec quo modo conveniant, non sane intellego.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. An nisi populari fama? Eorum enim est haec querela, qui sibi cari sunt seseque diligunt. Apud ceteros autem philosophos, qui quaesivit aliquid, tacet; Duo Reges: constructio interrete. Qui autem esse poteris, nisi te amor ipse ceperit? Is ita vivebat, ut nulla tam exquisita posset inveniri voluptas, qua non abundaret. Sed tamen intellego quid velit. Quo modo autem optimum, si bonum praeterea nullum est? Quoniam, si dis placet, ab Epicuro loqui discimus. In his igitur partibus duabus nihil erat, quod Zeno commutare gestiret. Quarum ambarum rerum cum medicinam pollicetur, luxuriae licentiam pollicetur. Haec quo modo conveniant, non sane intellego.</p>'
            }
        },
        {
            partial: 'app/src/modules/video/video',
            video: {
                url: 'http://example.com/test/g7/asset/video/g7-intro.mp4',
                quality: 70,
                previewImage: {
                    url: 'data/assets/video_dergipfel.png',
                    quality: 70
                },
                source: 'DPA',
                autoplay: true,
                type: 'video',
                displayMode: 'float-left'
            }
        },
        {
            partial: 'app/src/modules/text/text',
            text: {
                withInitial: false,
                content:
                    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. An nisi populari fama? Eorum enim est haec querela, qui sibi cari sunt seseque diligunt. Apud ceteros autem philosophos, qui quaesivit aliquid, tacet; Duo Reges: constructio interrete. Qui autem esse poteris, nisi te amor ipse ceperit? Is ita vivebat, ut nulla tam exquisita posset inveniri voluptas, qua non abundaret. Sed tamen intellego quid velit. Quo modo autem optimum, si bonum praeterea nullum est? Quoniam, si dis placet, ab Epicuro loqui discimus. In his igitur partibus duabus nihil erat, quod Zeno commutare gestiret. Quarum ambarum rerum cum medicinam pollicetur, luxuriae licentiam pollicetur. Haec quo modo conveniant, non sane intellego.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. An nisi populari fama? Eorum enim est haec querela, qui sibi cari sunt seseque diligunt. Apud ceteros autem philosophos, qui quaesivit aliquid, tacet; Duo Reges: constructio interrete. Qui autem esse poteris, nisi te amor ipse ceperit? Is ita vivebat, ut nulla tam exquisita posset inveniri voluptas, qua non abundaret. Sed tamen intellego quid velit. Quo modo autem optimum, si bonum praeterea nullum est? Quoniam, si dis placet, ab Epicuro loqui discimus. In his igitur partibus duabus nihil erat, quod Zeno commutare gestiret. Quarum ambarum rerum cum medicinam pollicetur, luxuriae licentiam pollicetur. Haec quo modo conveniant, non sane intellego.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. An nisi populari fama? Eorum enim est haec querela, qui sibi cari sunt seseque diligunt. Apud ceteros autem philosophos, qui quaesivit aliquid, tacet; Duo Reges: constructio interrete. Qui autem esse poteris, nisi te amor ipse ceperit? Is ita vivebat, ut nulla tam exquisita posset inveniri voluptas, qua non abundaret. Sed tamen intellego quid velit. Quo modo autem optimum, si bonum praeterea nullum est? Quoniam, si dis placet, ab Epicuro loqui discimus. In his igitur partibus duabus nihil erat, quod Zeno commutare gestiret. Quarum ambarum rerum cum medicinam pollicetur, luxuriae licentiam pollicetur. Haec quo modo conveniant, non sane intellego.</p>'
            }
        }
    ],

    furtherReading: [
        {
            kicker: 'Dachzeile',
            headline: 'Hier steht eine kleine Blindüberschrift',
            link: 'http://example.com',
            image: {
                type: 'image',
                url: 'data/assets/houseAtNight.jpg',
                quality: 70
            }
        },
        {
            kicker: 'Island',
            headline: 'Was für ein schönes Parlament die doch haben',
            link: 'http://example.com',
            image: {
                type: 'image',
                url: 'data/assets/houseAtNight.jpg',
                quality: 70
            }
        },
        {
            kicker: 'The world is not enough',
            headline: 'Na was haben wir denn da? Logos!',
            link: 'http://example.com',
            image: {
                type: 'image',
                url: 'data/assets/houseAtNight.jpg',
                quality: 70
            }
        }
    ],

    credits: [
        {
            what: 'Gestaltung und Infografiken',
            who: 'Manni Kostryzinsikissi'
        },
        {
            what: 'Redaktion',
            who: 'Rolfmann Jaschneskie'
        },
        {
            what: 'Programmierung',
            who: 'Bämjanine Turban, Sascha Götzhoser'
        }
    ],

    seo: {
        title: 'Das ist ein Seitentitel',
        teaser: 'Das ist ein Teaser',
        keywords: 'Longread',
        schemaOrg: {
            title: 'Schema.org title',
            description: 'Schema.org description',
            image: { url: 'data/assets/coconut.jpg', quality: 70 },
            logo: 'small-black.png'
        }
    },
    socialMedia: {
        email: {
            sharingSubject: 'Mail subject with ümläuts',
            sharingBody: 'Mail body with ümläuts'
        },
        facebook: {
            title: 'Facebook title',
            description: 'Facebook description',
            image: { url: 'data/assets/coconut.jpg', quality: 70 }
        },
        twitter: {
            title: 'Twitter title',
            description: 'Twitter description',
            image: { url: 'data/assets/coconut.jpg', quality: 70 },
            sharingText: 'Twitter custom share message {{url}} with #hash #tags and ümläuts'
        },
        whatsapp: {
            sharingText: 'Whats app custom share message with ümläuts - {{url}}'
        }
    },
    dev: {
        customCSS: 'header { background-color: hotpink; }'
    }
};
