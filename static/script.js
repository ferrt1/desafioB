document.addEventListener("DOMContentLoaded", function () {
    // Definir bloques personalizados
    Blockly.defineBlocksWithJsonArray([
        {
            type: "saludar",
            message0: "saludar %1",
            args0: [
                {
                    type: "field_input",
                    name: "NOMBRE",
                    text: "Nombre",
                }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: 160,
            tooltip: "Saluda a la persona con el nombre dado o con una respuesta de preguntar.",
            helpUrl: "",
        },
        {
            type: "preguntar",
            message0: "preguntar %1",
            args0: [{ type: "field_input", name: "PREGUNTA", text: "¿Cuál es tu nombre?" }],
            previousStatement: null,
            output: "String",
            colour: 230,
            tooltip: "Hace una pregunta al usuario y devuelve la respuesta.",
            helpUrl: "",
        },
        {
            type: "sumar",
            message0: "sumar %1 y %2",
            args0: [
                { type: "input_value", name: "NUM1" },
                { type: "input_value", name: "NUM2" },
            ],
            output: "Number",
            colour: 120,
            tooltip: "Suma dos valores.",
            helpUrl: "",
        },
        {
            type: "consultarIA",
            message0: "consultarIA %1",
            args0: [{ type: "field_input", name: "PREGUNTA", text: "Escribe tu pregunta" }],
            output: "String",
            colour: 290,
            tooltip: "Consulta una IA y devuelve su respuesta.",
            helpUrl: "",
        }
    ]);

    Blockly.JavaScript["saludar"] = function (block) {
        var nombre = JSON.stringify(block.getFieldValue("NOMBRE") || "");
        var code = `alert("¡Hola, " + ${nombre} + "!");\n`;
        return code;
    };

    Blockly.JavaScript["preguntar"] = function (block) {
        var pregunta = JSON.stringify(block.getFieldValue("PREGUNTA") || "");
        var code = `prompt(${pregunta})`;
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    };

    Blockly.JavaScript["sumar"] = function (block) {
        var numA = Blockly.JavaScript.valueToCode(block, "NUM1", Blockly.JavaScript.ORDER_NONE) || "0";
        var numB = Blockly.JavaScript.valueToCode(block, "NUM2", Blockly.JavaScript.ORDER_NONE) || "0";
        var code = `var valor1 = parseFloat(${numA}) || 0;\nvar valor2 = parseFloat(${numB}) || 0;\nvar resultado = valor1 + valor2;\nalert("Resultado: " + resultado);\nresultado;`;
        return [code, Blockly.JavaScript.ORDER_ASSIGNMENT];
    };

    Blockly.JavaScript["consultarIA"] = function (block) {
        var pregunta = JSON.stringify(block.getFieldValue("PREGUNTA") || "");
        var code = `
            fetch('https://desafio-b.vercel.app/consultar_ia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pregunta: ${pregunta} })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert("Error en la IA: " + data.error);
                } else {
                    alert("Respuesta de la IA: " + data.choices[0].message.content);
                }
            })
            .catch(error => alert("Error en la consulta IA: " + error));
        `;
        return code;
    };
    
    // Inicializar Blockly
    var workspace = Blockly.inject("blocklyDiv", {
        toolbox: `
            <xml xmlns="https://developers.google.com/blockly/xml">
                <block type="saludar"></block>
                <block type="preguntar"></block>
                <block type="consultarIA"></block>
                <block type="sumar"></block>
                <block type="math_number">
                    <field name="NUM">0</field>
                </block>
                
            </xml>`
    });

    // Función para ejecutar el código generado
    window.ejecutarCodigo = function () {
        var codigoGenerado = Blockly.JavaScript.workspaceToCode(workspace);
        console.log("Código generado:\n", codigoGenerado);
        try {
            eval(codigoGenerado);
        } catch (e) {
            alert("Error al ejecutar el código: " + e);
        }
    };
});